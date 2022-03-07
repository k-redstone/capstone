const puppeteer = require("puppeteer");
const cheerio = require("cheerio");



const getArticleId = async(lists, $, page) => {
  for (let i = 0; i < lists.length; i++) {
    const articleId = $(lists[i]).attr('id');
    await page.goto(`https://api.everytime.kr/find/board/comment/list?id=${articleId}&limit_num=-1&articleInfo=true`)
    await page.waitForTimeout(1000)
  }
}



(async() => {
  try{
    // 브라우저를 실행한다.
    // 옵션으로 headless모드를 끌 수 있다.
    const browser = await puppeteer.launch({
      headless: false
    });
  
    // 새로운 페이지를 연다.
    const page = await browser.newPage();
    // const page2 = await browser.newPage();
  
    // 아이디 비번 설정
    const id = "che0618"
    const pw = "hongsuck36"
  
    // 페이지의 크기를 설정한다.
    // await page.setViewport({
    //   width: 1366,
    //   height: 768
    // });
  
  
    // URL에 접속한다.
    await page.goto('https://everytime.kr/login');
  
    await page.evaluate((id, pw) => {
      document.querySelector('.input input[name=userid]').value = id
      document.querySelector('.input input[name=password]').value = pw
    }, id, pw);
    // 로그인 버튼 클릭
    await page.click('.submit');
  
    // api 요청
    await page.goto("https://api.everytime.kr/find/board/article/list?id=370448&limit_num=20&start_num=1")
  
    await page.waitForTimeout(2000)
    // cheerio를 통해 xml 파일 처리
    const mainboard = await page.content()
    const $ = cheerio.load(mainboard, {xmlMode: true})
    const lists = $('#webkit-xml-viewer-source-xml > response > article');

    getArticleId(lists, $, page)


  } catch(error){
    console.log("Error:", error)
  }
})();
