
var onlineList = {};
class DataManager {
    static getInstance() {
        if (!DataManager.m_instance) {
            DataManager.m_instance = new DataManager();
        }
        return DataManager.m_instance;
    };

    setLineList (data){
        onlineList = data;
    }

    getLineList (){
        return onlineList;
    }
}
module.exports = DataManager.getInstance();
