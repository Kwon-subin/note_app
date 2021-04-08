/**
 * 1. 삭제하기
 * 2. 수정하기
 * 3. 내용 불러오기
 */

//내용 불러오기
function getMemo(){
    // 어떤 메모를 불러올지
    const query = window.location.search;
    
    const memo_id = query.slice(4);

    const storage = window.localStorage;
    const memo_data = storage.getItem(memo_id);

    if (!memo_data){
        alert('없는 메모입니다.');
        window.location.replace('/');
    }

    const input_element = document.getElementById('input');
    input_element.value = memo_data;
}

function editMemo(){

    if (!confirm('정말로 수정하시겠습니까?')){
        return;
    }

    const query = window.location.search;
    const memo_id = query.slice(4);

    const form = document.getElementById('edit');
    form.action=`edit?id=${memo_id}`;
    form.submit(); //edit로 요청을 보내게 된다.
    alert('수정되었습니다.');

}

function deleteMemo(){

    if (!confirm('정말로 삭제하시겠습니까?')){
        return;
    }
    const query = window.location.search;
    const memo_id = query.slice(4);

    const form = document.getElementById('delete');
    form.action = `delete?id=${memo_id}`;
    form.submit(); 

    alert('삭제되었습니다.')
}

function backmain() {
    if (!confirm('뒤로 돌아가시겠습니까?')){
        return;
    }

    window.location.replace('/');
}

function logout(){
    if (!confirm('로그아웃 하시겠습니까?')){
        return;
    }
    
    const form = document.getElementById('logout');
    form.submit();
}
