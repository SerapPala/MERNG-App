
const {kurslar,egitmenler} = require('../ornekVeri')

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList} = require("graphql")

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
                return egitmenler.find(egitmen => egitmen.id===parent.egitmenId)
            }
        },
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        egitmen: {
            type: EgitmenType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return egitmenler.find(egitmen=>egitmen.id===args.id)
            }
        },
        egitmenler: {
            type: new GraphQLList(EgitmenType),
            resolve(parent,args){
                return egitmenler
            }
        },
        kurs: {
            type:KursType,
            args: {id:{type:GraphQLID}},
            resolve(parent,args){
                return kurslar.find(kurs =>kurs.id===args.id)
            }
        },
        kurslar: {
            type: new GraphQLList(KursType),
            args: {id:{type:GraphQLID}},
            resolve(parent,args){
                return kurslar
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})
