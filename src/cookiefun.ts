import puppeteer from "puppeteer";

(async () => {
    let browser;  // Declare at the top of the function
    try {
        // 修改浏览器启动配置
        browser = await puppeteer.launch({ 
            headless: false,  // 改为有头模式，方便调试
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process'
            ]
        });
        console.log("Browser launched!");
        
        const page = await browser.newPage();
        
        // 设置用户代理
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
        
        // 设置视窗大小
        await page.setViewport({ width: 1280, height: 800 });
        
        const url = 'https://www.cookie.fun/';
        console.log("Navigating to:", url);
        
        // 修改导航配置
        await page.goto(url);
        
        console.log("Page loaded, waiting 5 seconds for dynamic content...");
        await page.setDefaultNavigationTimeout(5000);  // 等待动态内容加载
        
    
        
        await page.waitForSelector('table', { 
            timeout: 10000,
            visible: true 
        });
        
        // 获取表格数据
        const tableData = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('table tr'))
            return rows.map(row => {
                const cells = Array.from(row.querySelectorAll('td, th')); // 获取每个单元格
                return cells.map(cell => (cell as HTMLElement).innerText.trim());
            })    
        })
        console.log('tableData',tableData)

    } catch (error) {
        console.error("Detailed error:", error);
        // 如果浏览器还在运行，截图保存错误现场
        try {
            const page = (await browser?.pages())?.[0];
            if (page) {
                await page.screenshot({ path: 'error-screenshot.png' });
                console.log("Error screenshot saved as error-screenshot.png");
            }
        } catch (screenshotError) {
            console.error("Failed to save error screenshot:", screenshotError);
        }
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
})();