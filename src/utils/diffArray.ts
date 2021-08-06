function diffArray(arr: any[]) {
  var ret_array = new Array();
  for (var a = arr.length - 1; a >= 0; a--) {
    for (var b = arr.length - 1; b >= 0; b--) {
      if (arr[a] == arr[b] && a != b) {
        delete arr[b];
      }
    }
    if (arr[a] != undefined) ret_array.push(arr[a]);
  }
  return ret_array;
}
export default diffArray;
