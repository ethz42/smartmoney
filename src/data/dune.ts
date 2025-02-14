import { QueryParameter, DuneClient, RunQueryArgs } from "@duneanalytics/client-sdk";
const { DUNE_API_KEY } = process.env;

const client = new DuneClient(DUNE_API_KEY ?? "");
const queryId = 1215383;
const opts: RunQueryArgs = {
  queryId,
  query_parameters: [
    QueryParameter.text("TextField", "Plain Text"),
  ],
};

client
  .runQuery(opts)
  .then((executionResult) => console.log(executionResult.result?.rows));