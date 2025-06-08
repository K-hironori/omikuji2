document.addEventListener('DOMContentLoaded', () => {
    const omikujiArea = document.getElementById('omikuji-area');
    const tube = document.getElementById('tube');
    const stick = document.getElementById('stick');
    const fortuneText = stick.querySelector('.fortune-text');
    const drawAgainButton = document.getElementById('draw-again-button');
    const fireworksVideo = document.getElementById('fireworks');

    const fortunes = ["大吉", "吉", "中吉", "小吉", "末吉"];
    let canDraw = true;

    // 初期状態では棒を非表示
    stick.style.display = 'none';

    omikujiArea.addEventListener('click', () => {
        if (canDraw) {
            drawFortune();
        }
    });

    drawAgainButton.addEventListener('click', resetOmikuji);

    function drawFortune() {
        if (!canDraw) return;
        canDraw = false;

        const result = fortunes[Math.floor(Math.random() * fortunes.length)];
        fortuneText.textContent = result;
        
        // アニメーション開始前に棒を表示し、初期位置に設定
        stick.style.display = 'block'; 
        stick.style.transform = 'translate(-50%, 100%)'; // 開始位置（筒の中に隠れている）

        animateStick(result);
    }

    function animateStick(result) {
        const tl = anime.timeline({
            complete: () => {
                drawAgainButton.style.display = 'inline-block';
                if (result === "大吉") {
                    launchFireworks();
                }
            }
        });

        tl.add({
            targets: '#tube', // 筒を揺らすアニメーション
            rotate: [
                { value: 0, duration: 0 },
                { value: 5, duration: 75, easing: 'easeInOutQuad' },
                { value: -5, duration: 150, easing: 'easeInOutQuad' },
                { value: 0, duration: 75, easing: 'easeInOutQuad' }
            ],
        })
        .add({
            targets: '#stick', // 棒が飛び出すアニメーション
            translateY: [
                { value: '100%', duration: 0 }, // 開始Y位置 (自身の高さ分だけ下)
                { value: '-70%', duration: 500, easing: 'easeOutCubic' } // 終了Y位置 (自身の高さの70%分上に移動)
            ],
            offset: '-=150' // 筒の揺れアニメーションの途中から開始 (値を調整してタイミング変更可)
        })
        .add({
            targets: '#stick', // 棒のバウンドアニメーション
            translateY: '-80%', // さらに少し上に移動
            duration: 300,
            easing: 'easeOutElastic(1, .8)' // 弾性のあるイージング
        });
    }

    function launchFireworks() {
        fireworksVideo.style.display = 'block';
        fireworksVideo.currentTime = 0; // 動画を最初から再生
        fireworksVideo.play().catch(error => {
            // Autoplay policy might block play if not muted or no user interaction
            console.warn("Fireworks video play failed:", error);
        });
    }

    function resetOmikuji() {
        canDraw = true;
        stick.style.display = 'none';
        stick.style.transform = 'translate(-50%, 100%)'; // 棒を初期位置に戻す
        fortuneText.textContent = '';
        drawAgainButton.style.display = 'none';
        
        fireworksVideo.style.display = 'none';
        if (!fireworksVideo.paused) {
            fireworksVideo.pause();
        }
        fireworksVideo.currentTime = 0;

        // 筒の回転をリセット (必要であれば)
        anime({
            targets: '#tube',
            rotate: 0,
            duration: 100
        });
    }
});
