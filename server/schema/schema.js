
const {kurslar,egitmenler} = require('../ornekVeri')
const Kurs = require('../models/Kurs')
const Egitmen = require('../models/Egitmen')


const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList} = require("graphql")

//#region types

const EgitmenType = new GraphQLObjectType({
    name: 'Egitmen',
    fields:()=>({
        id: {type: GraphQLID},
        isim:{type:GraphQLString},
        email: {type:GraphQLString}
    })
})

const KursType = new GraphQLObjectType({
    name: 'Kurs',
    fields:()=>({
        id: {type: GraphQLID},
        isim:{type:GraphQLString},
        aciklama: {type:GraphQLString},
        durum: {type:GraphQLString},
        egitmen: {
            type:EgitmenType,
            resolve(parent,args){
                return Egitmen.findBydId(parent.id)
            }
        },
    })
})

//#endregion

//#region RootQuery

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        egitmen: {
            type: EgitmenType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Egitmen.findById(args.id)
            }
        },
        egitmenler: {
            type: new GraphQLList(EgitmenType),
            resolve(parent,args){
                return Egitmen.find()
            }
        },
        kurs: {
            type:KursType,
            args: {id:{type:GraphQLID}},
            resolve(parent,args){
                return Kurs.findById(args.id)
            }
        },
        kurslar: {
            type: new GraphQLList(KursType),
            args: {id:{type:GraphQLID}},
            resolve(parent,args){
                return Kurs.find()
            }
        }
    }
})

//#endregion

module.exports = new GraphQLSchema({
    query: RootQuery
})
