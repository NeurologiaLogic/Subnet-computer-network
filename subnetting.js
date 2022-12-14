let listOfHosts =
  `172.16.1.0/16
  172.18.1.0/16
  172.18.0.255/16
  172.17.0.0/16
`.split(/[\s\n]/).filter(val => val !== "")
// 172.16.0.0/16
//


let resultsOfValidation = []
const autoValidation = () => {
  return resultsOfValidation.filter(val => val[0] != val[1])
}
const intToDecimal = (val) => {
  val = parseInt(val)
  let value = (!val) ? "00000000" : ""
  let counter = 7
  while (val) {
    if (val - 2 ** counter >= 0) {
      value += '1'
      val -= 2 ** counter
    } else {
      value += '0'
    }
    counter--;
  }
  while (value.length < 8) {
    value += '0'
  }
  return value
}
const decimalToInt = (decimal) => {
  let value = 0
  const counter = 7;
  for (let i = 0; i < decimal.length; i++) {
    value += (decimal[i] === '1') ? 2 ** (counter - i) : 0
  }
  return value
}
const cidr = (val) => {
  // #tabel cidr
  const cidrTable = [
    0, 128, 192, 224, 240, 248, 252, 254, 255
  ]
  return cidrTable[val]
}
const subnetToDecimal = (subnet) => {
  let value = []
  while (subnet) {
    // subnet/8!=Math.floor(subnet/8)
    if (subnet - 8 >= 0) {
      value.push('255')
      subnet -= 8
    } else {
      value.push(cidr(subnet))
      subnet = 0
    }
  }
  while (value.length < 4) {
    value.push('0')
  }
  let subnetToSubnetDot = value.join('.')
  return subnetToSubnetDot.split('.').map(val => intToDecimal(val)).join("")
}
const ipToDecimal = (ip) => {
  return ip.split('.').map(val => intToDecimal(val)).join("")
}
const decimalToIp = (decimal) => {
  return decimal.split('.').map(val => decimalToInt(val)).join(".")
}
const AND = (a, b) => {
  let value = ""
  for (let i = 0; i < 8 * 4; i++) {
    if (a[i] === '1' && b[i] === '1')
      value += '1'
    else value += '0'
  }
  return value
}
const OR = (a, b) => {
  let value = ""
  for (let i = 0; i < 8 * 4; i++) {
    if (a[i] === '1' || b[i] === '1')
      value += '1'
    else value += '0'
  }
  return value
}

const printDots = (val) => {
  let value = ""
  for (const [i, v] of val.split('').entries()) {
    value += v
    if ((i + 1) % 8 === 0 && i + 1 !== 8 * 4) {
      value += '.'
    }
  }
  return value
}
/*
  @listOfHosts -> list of ip addresses to validate
*/
const validateNAandBA=(listOfHosts)=>{
  for (let search of listOfHosts) {
    const [ip, subnet] = search.split('/')
    let Ip = decimalToIp(printDots(ipToDecimal(ip)))
    let IpInDecimal = printDots(ipToDecimal(ip))
    let SubnetMask = decimalToIp(printDots(subnetToDecimal(subnet)))
    let SubnetMaskInDecimal = printDots(subnetToDecimal(subnet))
    let Na = decimalToIp(printDots(AND(ipToDecimal(ip), subnetToDecimal(subnet))))
    let NaInDecimal = printDots(AND(ipToDecimal(ip), subnetToDecimal(subnet)))
    let Ba = decimalToIp(printDots(OR(ipToDecimal(ip), subnetToDecimal(subnet))))
    let BaInDecimal = printDots(OR(ipToDecimal(ip), subnetToDecimal(subnet)))
    resultsOfValidation.push([ip, Na])
    let cidr = 32 - subnet;
    console.log("==================================================================")
    console.log(`IP: ${Ip}`)
    console.log(`IP in Decimal: ${IpInDecimal}`)
    console.log(`Subnet mask: ${SubnetMask}`)
    console.log(`Subnet mask in Decimal: ${SubnetMaskInDecimal}`)
    console.log(`Network Address: ${Na}`)
    console.log(`Network Address in Decimal: ${NaInDecimal}`)
    console.log(`Broadcast Address: ${Ba}`)
    console.log(`Broadcast Address in Decimal: ${BaInDecimal}`)
  }
  let validationResult = autoValidation()
  if (validationResult.length) {
    console.log('\x1b[31m%s', 'Some of the NA are incorrect');
    for (let i of validationResult) {
      console.log(`IP: ${i[0]} has NA: ${i[1]}`)
    }
    console.log('\x1b[0m')
  } else {
    console.log('\x1b[32m%s\x1b[0m', 'All of the NA are Correct');
  }
  console.log("==================================================================")
}
// validateNAandBA(listOfHosts)
//diatas untuk mengvalidasi NA dan BA sebuah network
let NAHost = "172.20.0.0/16"
const ipHostSize = (NAHost) => {
  NAHost = NAHost.split('/')
  console.log(`IP:${NAHost[0]}/${NAHost[1]}`)
  console.log(`Total number of host: ${(2**(32-NAHost[1]))-2}`)
}
/*
  @NaHost -> ip address with subnet, ex:192.168.1.1/24
*/
ipHostSize(NAHost)
//diatas untuk mengecek berapa banyak host yang bisa di tampung sebuah address
const NA = "172.20.1.0/16"
const names =
`Jurusan_B
Jurusan_A
Kelas_A
Kelas_B
Kelas_C
Kelas_D
Kelas_E
Kelas_F`
  .split(/[\n]/)
  .filter(str => str !== "")
const sizes =
`133
65
2
2
2
2
2
2`
  .split(/[\s\n]/)
  .filter(str => str !== "")
  .map(val => parseInt(val))


if (names.length !== sizes.length) {
  console.log("Error: names and sizes must have same length\nThe names must not be separated by space")
  process.exit(1)
}
const brandwidthConversion = (size) =>{
  const sizeNetwork={
    kbps : 1000,
    mbps : 1000**2,
    gbps : 1000**3
  }
  if(size<sizeNetwork.kbps){
    return `${size} Kpbs`
  }
  else if(size<sizeNetwork.mbps){
    return `${size/sizeNetwork.kbps} Mbps`
  }
  else{
    return `${size/sizeNetwork.mbps} Gbps`
  }
}
const TotalBrandwidthNeeded = (names,hosts, max_brandwidth_per_device) => {
  if (hosts) {
    hosts.map((host,index)=>console.log(`${names[index]} needs ${brandwidthConversion(host*max_brandwidth_per_device)}`))
    let total_brandwidth = hosts
      .reduce((prev,val) => prev+val,0)* max_brandwidth_per_device
      console.log(`Total_brandwidth needed: ${brandwidthConversion(total_brandwidth)} [brandwidth per device: ${max_brandwidth_per_device} kpbs]`)
      console.log("==================================================================")
      console.log(``)
    return total_brandwidth
  }
}
/*
  @sizes -> array of host size
  @brandwith size per device
*/
TotalBrandwidthNeeded(names,sizes, 500)
//diatas untuk mengecek kebutuhan brandwidth

let gedung = []
names.map((name, index) => {
  let temp = {}
  temp[name] = sizes[index]
  return gedung.push(temp)
})

gedung.sort((a, b) => Object.values(b)[0] - Object.values(a)[0])
//1. sort
//2. cari size k yang lebih besar dari 2^k>size+2
//3. print subnetting yang dimiliki
//4. either sort as a long list or sort per lantai
const getK = (size) => {
  let k = 0
  while (size + 2 > 2 ** k) {
    ++k
  }
  return k;
}

const subnetFromK = (k) => {
  let subnet = 32 - k;
  let decimalSubnet = decimalToIp(printDots(subnetToDecimal(subnet)))
  return decimalSubnet;
}

const getNextNA = (prev_ip, k) => {
  let ip = prev_ip.split('.')
  ip = ip.map(val => parseInt(val))
  let counterKtoFulfill = 2 ** k;
  while (counterKtoFulfill) {
    if (ip[3] === 255) {
      ip[3] = 0
      if (ip[2] === 255) {
        ip[2] = 0
        if (ip[1] === 255) {
          ip[1] = 0
          ip[0] += 1
        } else ip[1] += 1
      } else ip[2] += 1
    } else ip[3] += 1
    counterKtoFulfill--;
  }
  ip = ip.map(val => val.toString())
  return ip.join(".")
}

const getBA = (NA) => {
  let ip = NA.split('.').map(val => parseInt(val))
  let counterKtoFulfill = -1;
  while (counterKtoFulfill < 0) {
    if (ip[3] === 0) {
      ip[3] = 255
      if (ip[2] === 0) {
        ip[2] = 255
        if (ip[1] === 0) {
          ip[1] = 255
          ip[0] -= 1
        } else ip[1] -= 1
      } else ip[2] -= 1
    } else ip[3] -= 1
    counterKtoFulfill++;
  }
  ip = ip.map(val => val.toString())
  return ip.join(".")
}

const getLowerBoundIPRange = (ipRange) => {
  let ip = ipRange.split('.').map(val => parseInt(val))
  let counterKtoFulfill = 1;
  while (counterKtoFulfill) {
    if (ip[3] === 255) {
      ip[3] = 0
      if (ip[2] === 255) {
        ip[2] = 0
        if (ip[1] === 255) {
          ip[1] = 0
          ip[0] += 1
        } else ip[1] += 1
      } else ip[2] += 1
    } else ip[3] += 1
    counterKtoFulfill--;
  }
  ip = ip.map(val => val.toString())
  return ip.join(".")
}

const getUpperBoundIPRange = (ipRange) => {
  let ip = ipRange.split('.').map(val => parseInt(val))
  let counterKtoFulfill = -2;
  while (counterKtoFulfill < 0) {
    if (ip[3] === 0) {
      ip[3] = 255
      if (ip[2] === 0) {
        ip[2] = 255
        if (ip[1] === 0) {
          ip[1] = 255
          ip[0] -= 1
        } else ip[1] -= 1
      } else ip[2] -= 1
    } else ip[3] -= 1
    counterKtoFulfill++;
  }
  ip = ip.map(val => val.toString())
  return ip.join(".")
}
let firstIP = NA.split('/')
const fs = require('fs')
const appendData = (...str) => {
  for (const s of str) {
    fs.appendFile('data.csv', s, err => {
      if (err) {
        console.error(err)
        return
      }
    })
  }
}

const generateSubnet = (type) => {
  console.log(type)
  if (type != "FLSM" && type != "VLSM") {
    console.log("Type not defined only FLSM or VLSM available");
    process.exit(1)
  }
  console.log(`Initial IP ${NA}`)
  appendData("Name,Number of Electronics,NA,Network Range,BA,Subnet Mask\n");
  appendData("==============================================================\n");
  Object.entries(gedung).forEach(([_, value]) => {
    console.log("==================================================================")
    console.log(`Gedung ${Object.keys(value)}: ${ Object.values(value)[0]}`)
    let k = (type == "VLSM") ? getK(Object.values(value)[0]) : getK(Object.values(gedung[0])[0])
    let cidr = 32 - k;
    let localNA = null
    let range_below = null;
    let range_top = null;
    let nextNA = null
    let localBA = null;
    localNA = `${firstIP[0]}`;
    range_below = getLowerBoundIPRange(localNA)
    nextNA = `${getNextNA(localNA,k)}`
    localBA = getBA(nextNA)
    range_top = getUpperBoundIPRange(nextNA)
    console.log(`NA: ${localNA}/${cidr}`)
    console.log(`Range IP: ${range_below}/${cidr} - ${range_top}/${cidr}`)
    console.log(`BA: ${localBA}/${cidr}`)
    console.log(`Number of avl host: 0-${(2**k)-2}`)
    console.log(`Subnet: ${cidr}`)
    console.log(`Subnet in Decimal: ${subnetFromK(k)}`)
    // console.log(`${Object.keys(value)},${nextNA}/${cidr},${localBA}/${cidr},${range_below}/${cidr},${range_top}/${cidr}`)
    // console.log(`${Object.keys(value)},`, `${Object.values(value)},`, `${localNA}/${cidr},`, `${range_below}/${cidr} - ${range_top}/${cidr},`, `${getRangeIP(localBA[0], -1)}/${cidr},`, `${decimalSubnet}\n`)
    // appendData(`${Object.keys(value)},`, `${Object.values(value)},`, `${localNA}/${cidr},`, `${range_below}/${cidr} - ${range_top}/${cidr},`, `${localBA}/${cidr},`, `${decimalSubnet}\n`)
    firstIP = `${nextNA}/${firstIP[1]}`.split('/')
  })
}

generateSubnet('VLSM') //VLSM|FLSM