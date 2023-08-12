// const open = document.getElementById('open');
// const modalContainer = document.getElementById('modal-container');
// const close = document.getElementById('close');

// open.addEventListener("click", () => {
//   modalContainer.classList.add('show');
// })

// close.addEventListener("click", () => {
//     modalContainer.classList.remove('show');
//   })

let pdfDoc = null,
pageNum = 1,
pageRendering= false,
pageNumPending= null,
scale= 1,
canvas= document.getElementById('pdfCanvas'),
ctx= canvas.getContext('2d')

function renderPage(num) {
    //This code grabs the pdf
    pageRendering= true
    pdfDoc.getPage(num).then(page => {
        //Setting the viewport and styling
        let viewport = page.getViewport({scale: scale});
        canvas.height = viewport.height
        canvas.width = viewport.width

        let renderContext = {
            canvasContext: ctx,
            viewport: viewport
        }

        let renderTask = page.render(renderContext)
        //Taking the pdf and rendering it to display on website
        renderTask.promise.then((doc)=> {
            pageRendering = false;
            if (pageNumPending !== null) {
                //If 
                renderPage(pageNumPending)
                pageNumPending = null
            }
        })
    })
    document.getElementById('page_num').textContent = num;

}

function queRenderPage(num){
    if (pageRendering) {
        pageNumPending = num
    } else {
        renderPage(num)
    }
}

function onPrevPage() {
    //Makes current Page -1 of previous current page each time button is clicked
    if(pageNum <=1) {
        return
    }
    pageNum--;
    console.log("4:", pageNum)
    queRenderPage(pageNum)
}
document.getElementById('prev').addEventListener('click', onPrevPage)

function onNextPage() {
    //Makes current page +1 of previous current page each time button is clicked
    if (pageNum == pdfDoc.numPages){
        console.log(pageNum)
        console.log(pdfDoc.numPages)
        return;
    }
    pageNum++;
    console.log("3:", pageNum)
    queRenderPage(pageNum)
}
document.getElementById('next').addEventListener('click', onNextPage)


pdfjsLib.getDocument("Elias-Haynes-SWE-Resume.pdf").promise.then((doc) => {
    pdfDoc = doc
    document.getElementById('page_count').textContent = doc.numPages;
    renderPage(pageNum)
})

  

