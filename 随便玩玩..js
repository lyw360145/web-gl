function solution(numbers) {
    let arr = [];
    let result = [];
    while (numbers.length > 0) {
      const current = numbers.shift();
      if (arr.length === 0) {
        arr = String(current).split('');
        arr.forEach(item => {
          result.push(item - 0);
        })
      } else {
        const temp = String(current).split('');
        const tempArr = [];
        const tempResult = [];
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < temp.length; j++) {
            tempArr.push(arr[i] + temp[j]);
            tempResult.push(Number(result[i])  + Number(temp[j]));
          }
        }
        arr = tempArr;
        result = tempResult;
      }
    }
    const evenNumbers = []
    result.forEach(item => {
      if (item % 2 === 0) {
        evenNumbers.push(item);
      }
    })
    return evenNumbers.length;
  }
  
  function main() {
    // You can add more test cases here
    console.log(solution([123, 456, 789]) === 14);
    console.log(solution([123456789]) === 4);
    console.log(solution([14329, 7568]) === 10);
  }
  
  main();