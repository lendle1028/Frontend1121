window.addEventListener('load', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let brushColor = '#000000'; // 默認畫筆顏色
    let brushSize = 5; // 默認畫筆大小
    const savedStates = []; // 保存畫布
    let currentStep = -1; // 當前步驟
    var startPoint = { x: 0, y: 0 };
    let isStraightLine = false
    let isFreeLine = true;

    document.getElementById('imageLoader').addEventListener('change', handleImage, false);

    function handleImage(event) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                // 設置畫布尺寸為固定尺寸
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;

                // 清除畫布
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);

                // 計算最佳填充比例
                const ratio = Math.min(canvasWidth / img.width, canvasHeight / img.height);
                const x = (canvasWidth - img.width * ratio) / 2;
                const y = (canvasHeight - img.height * ratio) / 2;

                // 繪製調整後的圖片到畫布上
                ctx.drawImage(img, x, y, img.width * ratio, img.height * ratio);
                saveState(); // 保存新背景
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
    }



    document.getElementById('save').addEventListener('click', function () {
        const drawingCanvas = document.getElementById('drawingCanvas');
        const image = drawingCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

        // 創建一個臨時鏈接來下載圖片
        let tempLink = document.createElement('a');
        tempLink.href = image;
        tempLink.download = 'drawing.png';
        tempLink.click(); // 觸發下載
    });

    document.getElementById('dropdownMenuButton').addEventListener('click', function (event) {
        var dropdownMenu = document.querySelector('.dropdown-menu');
        if (dropdownMenu.style.display === 'block') {
            dropdownMenu.style.display = 'none';
        } else {
            dropdownMenu.style.display = 'block';
        }
    });

    function saveState() {
        // 保存當前畫布
        currentStep++;
        if (currentStep < savedStates.length) {
            savedStates.length = currentStep; // 刪除當前步驟之後的紀錄
        }
        savedStates.push(canvas.toDataURL()); // 保存當前畫布狀態
    }

    function loadBackground(imagePath) {
        // 清除畫布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 加載新背景
        const background = new Image();
        background.src = imagePath;
        background.onload = () => {
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            saveState(); // 背景加載后保存狀態
        };
    }

    // 更換畫筆顏色
    document.getElementById('brushColor').addEventListener('change', function () {
        brushColor = this.value;
    });

    // 更換畫筆大小
    document.getElementById('brushSize').addEventListener('change', function () {
        brushSize = this.value;
    });

    // 返回上一步
    document.getElementById('undo').addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            let previousState = new Image();
            previousState.src = savedStates[currentStep];
            previousState.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(previousState, 0, 0);
            };
        }
    });


    //實現繪圖
    function updatebrushSizeDisplay(){
        var brushSize = document.getElementById('brushSize').value;
        var brushSizeDisplay = document.getElementById('brushSizeDisplay');
        brushSizeDisplay.textContent = brushSize;
    }

    function Mode(){
        isStraightLine = !isStraightLine;
        isFreeLine = !isFreeLine;
        var icon = document.getElementById('modeIcon');
        icon.className = isStraightLine ? 'bi bi-toggle-on':'bi bi-toggle-off';
    }

    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return{
            x: e.clientX-rect.left,
            y: e.clientY-rect.top
        }
    }
    
    function draw(e) {
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = brushColor;
        ctx.beginPath()
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();

        startPoint = endPoint
    }

    function drawStraightLine(e) {
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = brushColor;
        ctx.beginPath()
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();

        startPoint = endPoint
    }

    canvas.addEventListener('mousedown', function(e) {
        isDrawing = true;
        startPoint = getMousePos(canvas, e);
    });
    canvas.addEventListener('mouseup', function (e) {
        if(isDrawing){
            if(isStraightLine){
                drawStraightLine(e);
            }
        }
        isDrawing = false;
        saveState(); // 完成繪製保存狀態
    });
    canvas.addEventListener('mousemove', function (e) {
        endPoint = getMousePos(canvas, e);
        if(isDrawing){
            if(isFreeLine){
                draw(e);
            }
        }
        
    });

   

    // 初始化背景圖片
    loadBackground('assets/img/drawing/street1.png');

    // 按鈕切換背景圖片
    document.getElementById('bg1').addEventListener('click', () => loadBackground("assets/img/drawing/street1.png"));
    document.getElementById('bg2').addEventListener('click', () => loadBackground("assets/img/drawing/street2.png"));
    document.getElementById('bg3').addEventListener('click', () => loadBackground('assets/img/drawing/street3.png'));
    document.getElementById('bg4').addEventListener('click', () => loadBackground('assets/img/drawing/street4.png'));
    document.getElementById('bg5').addEventListener('click', () => loadBackground('assets/img/drawing/example.png'));
    document.getElementById('bg6').addEventListener('click', () => loadBackground('assets/img/drawing/improve_example.png'));
    document.getElementById('straightLine').addEventListener('click', () => Mode());
    document.getElementById('brushSize').addEventListener('change', () => updatebrushSizeDisplay());
});
