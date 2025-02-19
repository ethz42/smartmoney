import axios from 'axios';
import type { AxiosResponse } from 'axios';

interface ResultMetadata {
  column_names: string[];
  result_set_bytes: number;
  total_row_count: number;
  datapoint_count: number;
  pending_time_millis: number;
  execution_time_millis: number;
}

interface DuneApiResponse {
  execution_id: string;
  state: string;
}

interface DuneExecutionStatusResponse {
  execution_id: string;
  query_id: number;
  state: string;
  submitted_at: string;
  expires_at: string;
  execution_started_at: string;
  execution_ended_at: string;
  cancelled_at?: string;
  result_metadata: ResultMetadata;
}

interface Result {
  rows: Array<Array<{ TableName: string; ct: number }>>;
  metadata: ResultMetadata;
}

interface DuneExecutionResultResponse {
  execution_id: string;
  query_id: number;
  state: string;
  submitted_at: string;
  expires_at: string;
  execution_started_at: string;
  execution_ended_at: string;
  cancelled_at?: string;
  result: Result;
}

// dotenv.config();

// Define the parameter types
const QueryParameter = {
  text: (name: string, value: string) => {
    return { [name]: value };
  }
};

// Generic function to fetch data (POST request)
const fetchDataPost = async <T>(url: string, apiKey: string, body: Record<string, unknown> = {}): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.post(url, body, {
      headers: {
        'X-DUNE-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data (POST):', error);
    throw error;
  }
};

// Generic function to fetch data (GET request)
const fetchDataGet = async <T>(url: string, apiKey: string, params: Record<string, unknown> = {}): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.get(url, {
      headers: {
        'X-DUNE-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data (GET):', error);
    throw error;
  }
};

// Function to execute the query using POST request
const executeQuery = async (queryId: string, apiKey: string, queryParameters:{ [name: string]: string}): Promise<DuneApiResponse> => {
  const url = `https://api.dune.com/api/v1/query/${queryId}/execute`;
  const body = {
    query_parameters: queryParameters,
    performance: 'medium'
  };
  return fetchDataPost<DuneApiResponse>(url, apiKey, body);
};

// Function to get execution status using GET request
export const getExecutionStatus = async (executionId: string, apiKey: string): Promise<DuneExecutionStatusResponse> => {
  const url = `https://api.dune.com/api/v1/execution/${executionId}/status`;
  return fetchDataGet<DuneExecutionStatusResponse>(url, apiKey);
};

// Function to get execution results using GET request
const getExecutionResults = async (executionId: string, apiKey: string): Promise<DuneExecutionResultResponse> => {
  const url = `https://api.dune.com/api/v1/execution/${executionId}/results`;
  return fetchDataGet<DuneExecutionResultResponse>(url, apiKey);
};

// Function to chain executing the query, checking status, and fetching results
export const executeFullProcess = async (queryId: string, apiKey: string, contractAddress: string) => {
  try {
    console.log('Step 1: Execute Query');
    const queryParameters = QueryParameter.text("contract_address", contractAddress);
    const queryResponse = await executeQuery(queryId, apiKey, queryParameters);
    console.log('Query executed successfully. Execution ID:', queryResponse.execution_id);

    let executionStatus: DuneExecutionStatusResponse;
    let status = 'QUERY_STATE_PENDING';
    const executionId = queryResponse.execution_id;

    // Step 2: Check execution status until it is completed
    while (status !== 'QUERY_STATE_COMPLETED') {
      console.log('Step 2: Checking execution status...');
      executionStatus = await getExecutionStatus(executionId, apiKey);
      status = executionStatus.state;
      console.log(`Execution state: ${status}`);

      if (status === 'QUERY_STATE_FAILED') {
        console.error('Query execution failed.');
        return;
      }

      // Wait a few seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
    }

    // Step 3: Get execution results after successful completion
    console.log('Step 3: Fetching execution results...');
    const executionResults = await getExecutionResults(executionId, apiKey);
    console.log('Execution results:', executionResults);

  } catch (error) {
    console.error('Error during full process:', error);
  }
};

// Example usage
const queryId = process.env.QUERY_ID!; // 替换成实际的查询ID
const apiKey = process.env.DUNE_API_KEY!; // 环境变量

const contractAddress = '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN';

executeFullProcess(queryId, apiKey, contractAddress);