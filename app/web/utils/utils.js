export function uuid() {
  /* jshint bitwise:false */
  let i;
  let random;
  let uuidStr = '';

  for (i = 0; i < 32; i++) {
    random = (Math.random() * 16) | 0; // eslint-disable-line
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuidStr += '-';
    }
    uuidStr += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(
      16
    ); // eslint-disable-line
  }

  return uuidStr;
}

export function formatDate(date, mask) {
  let d;
  try {
    d = new Date(date);
  } catch (error) {
    return '';
  }

  if (d.toString() === 'Invalid Date') {
    return '';
  }

  function zeroize(value, length) {
    let lengthTemp = length;
    let valueTemp = String(value);
    if (!length) {
      lengthTemp = 2;
      valueTemp = String(valueTemp);
    }
    let zeros = '';
    for (let i = 0; i < lengthTemp - valueTemp.lengthTemp; i++) {
      zeros += '0';
    }
    return zeros + valueTemp;
  }

  const regex = /"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g;

  return mask.replace(regex, $0 => {
    switch ($0) {
      case 'd':
        return d.getDate();
      case 'dd':
        return zeroize(d.getDate());
      case 'ddd':
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
      case 'dddd':
        return [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ][d.getDay()];
      case 'M':
        return d.getMonth() + 1;
      case 'MM':
        return zeroize(d.getMonth() + 1);
      case 'MMM':
        return [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ][d.getMonth()];
      case 'MMMM':
        return [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ][d.getMonth()];
      case 'yy':
        return String(d.getFullYear()).substr(2);
      case 'yyyy':
        return d.getFullYear();
      case 'h':
        return d.getHours() % 12 || 12;
      case 'hh':
        return zeroize(d.getHours() % 12 || 12);
      case 'H':
        return d.getHours();
      case 'HH':
        return zeroize(d.getHours());
      case 'm':
        return d.getMinutes();
      case 'mm':
        return zeroize(d.getMinutes());
      case 's':
        return d.getSeconds();
      case 'ss':
        return zeroize(d.getSeconds());
      case 'l':
        return zeroize(d.getMilliseconds(), 3);
      case 'L':
        let m = d.getMilliseconds();
        if (m > 99) m = Math.round(m / 10);
        return zeroize(m);
      case 'tt':
        return d.getHours() < 12 ? 'am' : 'pm';
      case 'TT':
        return d.getHours() < 12 ? 'AM' : 'PM';
      case 'Z':
        return d.toUTCString().match(/[A-Z]+$/);
      default:
        return $0.substr(1, $0.length - 2);
    }
  });
}

export function getSearchColumns(columns) {
  return (
    columns &&
    columns.map(value => ({
      data: value.dataIndex,
      searchable: true,
      orderable: true
    }))
  );
}

export function personTypes(value) {
  let name = '';

  switch (value) {
    case 'INITIATOR':
      name = '发布申请者';
      break;
    case 'TEST-QA':
      name = '测试环境测试者';
      break;
    case 'TEST-PRE-PROD':
      name = '预生产环境测试者';
      break;
    case 'TEST-PROD':
      name = '生产环境测试者';
      break;
    case 'OP':
      name = '部署发布者';
      break;
    case 'MGMT':
      name = '审批者';
      break;
    case 'ADMIN':
      name = '管理员';
      break;
    case 'TEST-APPROACH':
      name = '准生产环境测试者';
      break;
    default:
      name = value;
      break;
  }

  return name;
}

/**
 * 手机号脱敏
 * @param {*} data
 */
export function desensitization(data) {
  const reg = /^1\d{10}$/;
  return reg.test(data)
    ? `${data.substring(0, 3)}****${data.substring(7)}`
    : data;
}
