import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { DuneClient } from '@duneanalytics/client-sdk'
import { HttpsProxyAgent } from 'https-proxy-agent'

const agent = new HttpsProxyAgent('http://127.0.0.1:7890') 
const bot = new Telegraf('6914618255:AAEKGrm34t91frhcp9RzYKM48hAOPLk-Gx4', {
    telegram: {
        agent  // 使用代理
    }
})

async function fetchHighProfitAddresses(contractAddress: string) {
    try {
        const dune = new DuneClient("FgfhUtIz6CIUoU6If0p3aAKMvNk7K3Yl");
        const query_result = await dune.getLatestResult({queryId: 4674725});
        const results = query_result.result!.rows.map(row => {
            const address = (row as any).address;
            const profit = ((row as any).realized_pnl_usd as number).toFixed(2)
            return `\`${address}\` 地址已实现利润为 ${profit.replace('.', '\\.')}usd`;
        });
        return results.join('\n');
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('获取数据失败');
    }
}

bot.on(message('text'), async (ctx) => {
    try {
        const contractAddress = ctx.text;
        console.log(contractAddress)
        const highProfitAddresses = await fetchHighProfitAddresses(contractAddress!);
        await ctx.telegram.sendMessage(ctx.message.chat.id, highProfitAddresses, {
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Error processing message:', error);
        await ctx.telegram.sendMessage(ctx.message.chat.id, '抱歉，处理请求时出错了');
    }
});
// (async ()=> {
//     const dune = new DuneClient("FgfhUtIz6CIUoU6If0p3aAKMvNk7K3Yl");
//     const query_result = await dune.getLatestResult({queryId: 4674725})
//     console.log(query_result)
// })();



bot.launch()