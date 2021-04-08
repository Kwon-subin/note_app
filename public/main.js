/** 
 * 1. 로그아웃 기능 - 서버랑 연동이 되어야해서 지금 못함
 * 2. 작성하기 기능 
 * 3. 과거에 작성한 것을 받아오는 기능
 * 
 * 웹 저장소에 저장
 * 
 * Web Storage API
 * 
 * local storage - 영구적
 * session storage - 웹을 끄면 다 날아간다. 즉 일시적
*/

//작성하기
function addMemo() {
    const input_text = document.getElementById('input').value;

    // 1. 빈 메모일 경우에는 안된다 말하기
    if (!input_text.length){
        alert('메모가 없습니다. 멈춰!');
        return;
    }

    // let today = new Date();
    // let hours = today.getHours();
    // let minutes = today.getMinutes();
    // let seconds = today.getSeconds();
    
    // hours *= 10000;
    // minutes *= 100;
    
    // let time = hours + minutes + seconds;
    

    // // const storage = window.localStorage;
    // const id = storage.length + time;
    
    // storage.setItem(id, input_text);

    // 2. 입력이 성공했을 경우, input 안의 내용 비우기
    // document.getElementById('input').value = '';
    // alert('입력이 성공하였습니다.');

    // 요청 보내기
    const form = document.getElementById('write');
    form.submit(); // '/' 위치로 POST 요청을 보낸다.
    alert('작성되었습니다.');

    // // 글 요소를 만들고 자식으로 넣기
    // const note_container = document.getElementsByClassName('main__note-contents')[0];
    // // TODO: main__note-content div를 만들고 note_container에 추가
    // const note_content = document.createElement('div');
    // note_content.className = 'main__note-content';
    // note_content.innerText = input_text;
    
    // const link_element = document.createElement('a');
    // link_element.href = `./edit?id=${id}`;

    // link_element.appendChild(note_content);
    

    
    // note_container.appendChild(link_element);
}

// 저장소에 있는 글 가져오기
function getMemos(){
    const storage = window.localStorage;
    console.log(storage);
    const memos = Object.entries(storage);
    console.log(memos);
    
    const note_container = document.getElementsByClassName('main__note-contents')[0];

    memos.forEach((memo) => {
        const id = memo[0];
        const data = memo[1];

        const note_content = document.createElement('div');
        note_content.className = 'main__note-content';
        note_content.innerText = data;
        
        
        /**
                    <div class="main__note-content">
                        메모들이 여기에 들어갑니다.
                    </div>
         */

        const link_element = document.createElement('a');
        link_element.href = `./edit?id=${id}`;

        //<a href="./edit.html"></a>
        
        link_element.appendChild(note_content);
        note_container.appendChild(link_element);
    });
}

function logout(){
    if (!confirm('로그아웃 하시겠습니까?')){
        return;
    }
    
    const form = document.getElementById('logout');
    form.submit();
}