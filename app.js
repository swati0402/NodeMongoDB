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