function get_scroll_area() {
    const scroll_area = getElementByXpath('/html/body/div[1]/div[3]/div/div/div[2]/div/main/div/div[3]/div/div/div/div[2]/div/div/div/div[3]/div[3]');
    return scroll_area;
}
// /html/body/div[1]/div[3]/div/div/div[2]/div/main/div/div[3]/div/div/div/div[2]/div/div/div/div[2]/div/div/div/div/div[4]/div/button
function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function scrollBottom() {
    scroll_area = get_scroll_area();
    scroll_area.scrollTop = scroll_area.scrollHeight;
}

//scroll dinaamic reander area to bottom

function getCurrentAllCut() {
    const allRows = document.querySelectorAll('.Layout-sc-1xcs6mc-0.eAnYGM.clmgr-table__row');
    return allRows
}




 const  choose =async () => {
    
    sign = true;

    while (sign) {
        scrollBottom();
        //sleep for 1 second
        await new Promise(r => setTimeout(r, 2000));
        const clientHeight = scroll_area.clientHeight;
        const scrolltop = scroll_area.scrollTop;
        const scrollHeight = scroll_area.scrollHeight;
        if (clientHeight + scrolltop >= scrollHeight) {
            console.log('end of page');
            sign = false;
        }
        //天前出現停止
        let allRows = getCurrentAllCut();
        for (let i = 0; i < allRows.length; i++) {
            // console.log(allRows[i].innerText.split('\n')[5].indexOf('天前'));
            // console.log(allRows[i].innerText.split('\n')[5]);
            if (allRows[i].innerText.split('\n')[5].indexOf('天前') != -1) {
                // console.log('loaded one month ago');
                days = allRows[i].innerText.split('\n')[5].split('天前')[0];
                // console.log(days);
                if (parseInt(days) > 7) {
                    console.log('loaded almost one week ago');
                    sign = false;
                }
            }
        }
    }
    let allRows = getCurrentAllCut();

    //find from allRows and print the index which is elements in allRows has duplicate
    console.log("collect all the cut names");
    const cut_names = [];
    for (let i = 0; i < allRows.length; i++) {
        //split the text by new line
        cut_names.push(allRows[i].innerText.split('\n')[1]);
    }

    let duplicateIndex = {};
    for (let i = 0; i < cut_names.length; i++) {
        if (Object.keys(duplicateIndex).includes(cut_names[i])) {
            duplicateIndex[cut_names[i]].push(i)
        }
        else {
            duplicateIndex[cut_names[i]] = [i];
        }
    }

    let duplicateIndex_ = {};
    //remove higheset view
    for (let i = 0; i < Object.keys(duplicateIndex).length; i++) {
        let key = Object.keys(duplicateIndex)[i];
        let indexs = duplicateIndex[key];

        if (indexs.length >= 2) {
            duplicateIndex_[key] = {};
            for (let j = 0; j < indexs.length; j++) {
                let time = allRows[indexs[j]].innerText.split('\n')[5];
                if (Object.keys(duplicateIndex_[key]).includes(time)) {
                    console.log('exist');
                    duplicateIndex_[key][time].push(indexs[j])
                }
                else {
                    console.log('new time key');
                    duplicateIndex_[key][time] = [indexs[j]];
                }

            }
        }
    }


    console.log("check the duplicate cut names,pleace wait for a while");
    for(let i = 0; i < Object.keys(duplicateIndex_).length; i++){
        let key = Object.keys(duplicateIndex_)[i];
        for (let j = 0; j < Object.keys(duplicateIndex_[key]).length; j++) {
            let time_key = Object.keys(duplicateIndex_[key])[j];
            // console.log((duplicateIndex_[key][time_key]));
            // console.log((duplicateIndex_[key][time_key]).length);
            for (let index = 0; index < duplicateIndex_[key][time_key].length; index++) {
                allRows[duplicateIndex_[key][time_key][index]].querySelector('.tw-checkbox__label').click();
            }
            
        }

    }
};

const select_no_nochange_title = async () => {
    sign = true;

    while (sign) {
        scrollBottom();
        //sleep for 1 second
        await new Promise(r => setTimeout(r, 2000));
        const clientHeight = scroll_area.clientHeight;
        const scrolltop = scroll_area.scrollTop;
        const scrollHeight = scroll_area.scrollHeight;
        if (clientHeight + scrolltop >= scrollHeight) {
            console.log('end of page');
            sign = false;
        }
        //天前出現停止
        let allRows = getCurrentAllCut();
        for (let i = 0; i < allRows.length; i++) {
            // console.log(allRows[i].innerText.split('\n')[5].indexOf('天前'));
            // console.log(allRows[i].innerText.split('\n')[5]);
            if (allRows[i].innerText.split('\n')[5].indexOf('天前') != -1) {
                // console.log('loaded one month ago');
                days = allRows[i].innerText.split('\n')[5].split('天前')[0];
                // console.log(days);
                if (parseInt(days) > 7) {
                    console.log('loaded almost one week ago');
                    sign = false;
                }
            }
        }
    }
    let allRows = getCurrentAllCut();
    for (let i = 0; i < allRows.length; i++) {
        //split the text by new line
        if (allRows[i].innerText.split('\n')[1].indexOf('【外神歪西】') != -1) {
            allRows[i].querySelector('.tw-checkbox__label').click();
        }
        
    }

}

const onMessage = (message) => {
    switch (message.action) {
        case 'CHOOSE':
            choose();
            break;
        case 'NOCHANGE':
            select_no_nochange_title();
            break;
        default:
            break;
    }
}

chrome.runtime.onMessage.addListener(onMessage);
