const MongoClient=require("mongodb").MongoClient
const url="mongodb://localhost:27017"
const dbname="circulation"
const cirRepo=require('./repos/circulationRepo')
const data= require('./circulation.json')
const assert=require('assert')

async function main(){
    const client =new MongoClient(url)
    await client.connect()
    try{
    //load data
    const results= await cirRepo.loadData(data)
    assert.equal(data.length,results.insertedCount)

    //get data
    const getdata=await cirRepo.get()
    assert.equal(getdata.length,getdata.length)
    
    //filter data
    const filterdata=await cirRepo.get({Newspaper: getdata[4].Newspaper})
    assert.deepEqual(filterdata[0],getdata[4])
    
    //limit
    const limit=await cirRepo.get({},3)
    assert.equal(limit.length,3)

    //getbyid
    const getByIddata= await cirRepo.getById(getdata[4]._id)
    assert.deepEqual(getByIddata,getdata[4])

    //add items
    const newItem={
        "Newspaper": "Add New paper",
        "Daily Circulation, 2004": 1,
        "Daily Circulation, 2013": 1,
        "Change in Daily Circulation, 2004-2013": 1,
        "Pulitzer Prize Winners and Finalists, 1990-2003": 0,
        "Pulitzer Prize Winners and Finalists, 2004-2014": 0,
        "Pulitzer Prize Winners and Finalists, 1990-2014": 0
    }
    const addedItem= await cirRepo.add(newItem)
    assert(addedItem)

    const getaddedItem= await cirRepo.getById(addedItem)
    //console.log(getaddedItem)
    assert.deepEqual(getaddedItem,newItem)

    //update item
    const updateItem={
        "Newspaper": "My New paper",
        "Daily Circulation, 2006": 1,
        "Daily Circulation, 2013": 1,
        "Change in Daily Circulation, 2006-2013": 1,
        "Pulitzer Prize Winners and Finalists, 1990-2003": 0,
        "Pulitzer Prize Winners and Finalists, 2004-2014": 0,
        "Pulitzer Prize Winners and Finalists, 1990-2014": 0
    }
    const updateItemId= await cirRepo.update(updateItem,addedItem)
    const getupdatedItem= await cirRepo.getById(addedItem)
    //console.log(getupdatedItem)
    //assert.deepEqual(getupdatedItem,updateItem)

    //delete item
    const deleteItem=await cirRepo.deleteItem(getdata[4]._id)
    assert(deleteItem)

    //avergae finalist
    const avgFinalist= await cirRepo.averageItems()
    console.log("Average Finalist: "+avgFinalist)

    //avergae by change including negative values
    const avgFinalistChange= await cirRepo.averageItemsbyChange()
    console.log(avgFinalistChange)
    }
    catch(error){
        console.log(error)
    }
    const admin= client.db(dbname).admin()
    //console.log(await admin.serverStatus())
    await client.db(dbname).dropDatabase()
    console.log(await admin.listDatabases())
    client.close()
}
main()