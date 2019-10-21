const express = require('express')
const request = require('request')

const app = express()

const port = process.env.PORT || 3000

url_matricula = ""
url_met = ""

    if ( process.env.NODE_ENV === 'production') {
        url_matricula = 'https://parcial2deweb.herokuapp.com/students/A01196516'
        url_met = 'https://parcial2deweb.herokuapp.com/met?search=sunflower'
    } 
    else {  
        url_matricula = 'http://localhost:' + port + '/students/A01196516'
        url_met = 'http://localhost:' + port + '/met?search=sunflowers'
    }
  


app.get('/prueba_student', function(req, res) {
    res.redirect(url_matricula)
})

app.get('/prueba_met', function(req, res) {
    res.redirect(url_met)
})

app.get('/students/:id', function(req, res) {
    var_id = req.params.id
    if( req.params.id == 'A01196516' ){
        res.send({ 
            id: var_id ,
            fullname: "Alberto Bermea",
            nickname: "Chikistrikis",
            age: 22
        })
    }
    else{
        res.send({ 
            error: "There is an error ese"
        })
    }
  })

app.get('/met', function(req, res) {
    const object = req.query.search

    console.log(object)
    
    //const object = 'jhgfdxszxdfghjkjhuygtfrde'
    
    searchObjects(object,function(data){
        if(data.error){
            console.log(data)
        }
        else{
            objectId = data.object
            //objectId = '999999999999999'

            searchSpecificObject(objectId,function(data){
                
                if(data.error){
                    console.log(data)
                }
                else{
                    res.send({
                        searchTerm: object,
                        artist : data.artist,
                        title: data.title,
                        year: data.year,
                        technique: data.technique,
                        metUrl: data.metUrl
                    })
                }

            })

        }        
    })
})

app.get('*', function(req, res) {
    res.send({ 
        error: "Ruta no valida ese"
    })
})

app.listen(port,function(){
    console.log('UPA AND RUNNING!!!')
})

const searchObjects = function(object, callback){
    const url = 'https://collectionapi.metmuseum.org/public/collection/v1/search?q=' + object

    request({ url , json: true }, function(error,response){
        if(response.error){
            const info = {
                error: response.error
            }
            callback(info)
        }
        else{
            if(response.body.total == 0){
                const info = {
                    error: "No se encontro ningun objeto"
                }
                callback(info)
            }
            else{
                const info = {
                    object: response.body.objectIDs[0]
                }
                callback(info)
            }
        }
        
    })

}

const searchSpecificObject = function(object,callback){
    const url = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/' + object

    request({ url , json: true }, function(error,response){
        if(response.error){
            const info = {
                error: response.error
            }
            callback(info)
        }
        else{
            if( response.body.message == "ObjectID not found"){
                const info = {
                    error: "No se encontro ningun objeto"
                }
                callback(info)
            }
            else{
                const info ={
                    artist : response.body.constituents[0].name,
                    title: response.body.title,
                    year: response.body.objectEndDate,
                    technique: response.body.medium,
                    metUrl: response.body.objectURL
                }
                callback(info)
            }
        }
        
    })
    
}