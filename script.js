document.addEventListener('DOMContentLoaded', () => {
    const robot = document.getElementById('robot');
    const expressionButtons = document.querySelectorAll('.expression-btn');
    const actionButtons = document.querySelectorAll('.action-btn');
    const musicSlider = document.getElementById('musicSlider');
    const music = document.getElementById('music');
    const voiceBtn = document.getElementById('voiceBtn');
    const output = document.getElementById('output');
    const put =document.getElementById('put');
    // 检查浏览器是否支持语音识别
    // if (!('SpeechRecognition' in window && 'webkitSpeechRecognition' in window)) {
    //         voiceBtn.disabled = true;
    //         voiceBtn.textContent = '不支持语音识别';
    //         console.warn('浏览器不支持语音识别');
    // }

    const expressions = {
        '快乐': '777.gif',
        '眨眼': '888.gif',
        '睡觉': '999.gif'
    };

    
    expressionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const expression = btn.getAttribute('data-expression');
            robot.style.backgroundImage = `url('${expressions[expression]}')`;
        });
    });

    
    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            console.log(action);
            
        });
    });

    const musicFiles = ['music1.mp3', 'music2.mp3', 'music3.mp3','music4.mp3','music5.mp3','music6.mp3'];
    const musicNames = ['春庭雪', '尘曦', '诺言','吹梦到西洲','青花瓷','十年']; // 添加歌曲名称

    let currentSongIndex = 0;

   
    function playMusic(index) {
        if (index < 0) {
            index%=musicFiles.length;
            if(index!=0)
            {
                index+=musicFiles.length;
            }
           
        } else if (index >= musicFiles.length) {
            index %= (musicFiles.length); 
        }
        music.src = musicFiles[index];
        music.play().catch((error) => {
            console.error('Error playing music:', error);
        });
        currentSongIndex = index;

        // 输出歌曲名称
        const songName = musicNames[index];
        console.log('正在播放:', songName); // 控制台输出
        output.textContent = `正在播放: ${songName}`; // 页面显示
    }

   
    let isSliding = false;
    musicSlider.addEventListener('input', () => {
        isSliding = true;
    });

    musicSlider.addEventListener('change', () => {
       
        const value = musicSlider.value;

        if (value < 30) {
            
            currentSongIndex--;
            playMusic(currentSongIndex);
        } else if (value > 70) {
            
            currentSongIndex++;
            playMusic(currentSongIndex);
        } else {
            
            music.pause();
        }

        
        musicSlider.value = 50;
    });


    musicSlider.value = 50;

     // 音乐功能
     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
     recognition.lang = 'zh-CN';
 
     recognition.onresult = function(event) {
         const last = event.results.length - 1;
         const text = event.results[last][0].transcript.toLowerCase();
         console.log('语音输入:', text);
          // 将识别到的文本内容输出到页面的 #output 元素中
        put.textContent = '语音识别内容: ' + text;
 
         switch (text) {
             case '开始播放歌曲。':
                playMusic(currentSongIndex);
                break;
             case '播放下一首。':
                 currentSongIndex++;
                 playMusic(currentSongIndex);
                 break;
             case '播放上一首。':
                 currentSongIndex--;
                 playMusic(currentSongIndex);
                 break;
             case '暂停播放。':
                 music.pause();
                 break;
             case '继续播放。':
                 music.play();
                 break;
              case '音量增大。':
                if (music.volume <= 1) {
                music.volume += 0.25;
                 }
                 console.log('音量增大，当前音量:', music.volume);
                    break;
                case '音量减小。':
            if (music.volume > 0) {
                music.volume -= 0.25;
            }
            console.log('音量减小，当前音量:', music.volume);
            break;    
             default:
                 console.log('未识别的命令');
         }
     };
 
     recognition.onstart = function() {
         console.log('语音识别已启动');
     };
 
     recognition.onend = function() {
         console.log('语音识别已结束');
     };
 
     recognition.onerror = function(event) {
         console.error('语音识别错误:', event.error);
     };
 
     voiceBtn.addEventListener('click', () => {
         recognition.start();
     });

});