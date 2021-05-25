import _ from 'lodash'

class File {
    constructor(app, object){
        this.app = app;

        this.model = {
            name: null,
            originalname: null,
            mimetype: null,
            size: null,
            created: new Date().toLocaleString(),

        }
    }

    initWithObject(object){
        this.model.name = _.get(object, 'filename')
        this.model.originalname = _.get(object, 'originalname')
        this.model.mimetype = _.get(object, 'mimetype')
        this.model.size = _.get(object, 'size')
        this.model.created = new Date().toLocaleString()
        
        return this
    }

    toJSON(){
        return this.model
    }
}

export default File