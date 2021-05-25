import _ from 'lodash'

const KB = 1024
const MB = KB * KB
const GB = MB * KB

const converter = (input) => {
    if (input > GB) {
        return `${_.round(input/GB)}Gb`
    }
    else if (input > MB) {
        return `${_.round(input/MB)}Mb`
    }
    else {
        return `${_.round(input/KB)}Kb`
    }
}

export default converter