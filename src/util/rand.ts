/* Random Select */
export const selectRandElement = (arr: any[]) => {
    const randNum = Math.random() - Math.random(); 
    let selectNum = Math.floor(Math.abs(randNum)*10);
    if(selectNum > 6) selectNum = selectNum - 4;
    arr.sort(() => randNum);
    return arr.slice(0, selectNum+1);
}