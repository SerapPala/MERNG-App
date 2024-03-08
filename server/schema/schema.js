
const {kurslar,egitmenler} = require('../ornekVeri')
const Kurs = require('../models/Kurs')
const Egitmen = require('../models/Egitmen')


const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull,GraphQLEnumType} = require("graphql")

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


const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {

        egitmenEkle: {
            type:EgitmenType,
            args:{
                isim:{type:new GraphQLNonNull(GraphQLString)},
                email:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent,args){
                const egitmen = new Egitmen ({
                    isim:args.isim,
                    email:args.email
                })
                return Egitmen.save()
            }
        },

        egitmenSil: {
            type:EgitmenType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                return Egitmen.findByIdAndDelete(args.id)
            }
        },


        kursEkle: {
            type:KursType,
            args: {
                isim: {type: new GraphQLNonNull(GraphQLString)},
                aciklama: {type: new GraphQLNonNull(GraphQLString)},
                durum: {
                    type: new GraphQLEnumType({
                        name: 'KursDurumlar',
                        values: {
                            'yayin': {value: 'yayında'},
                            'olus':{value:'oluşturuluyor'},
                            'plan': {value:'planlanıyor'}
                        }
                    }),
                    defaultValue: 'planlanıyor'
                },
                egitmenId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                const kurs = new Kurs ({
                    isim:args.isim,
                    aciklama:args.aciklama,
                    durum:args.durum,
                    egitmenId:args.egitmenId
                })
                return Kurs.save()
            }
        },


        kursGuncelle: {
            type:KursType,
            args: {
                id:{type: new GraphQLNonNull(GraphQLID)},
                isim: {type:GraphQLString},
                aciklama: {type:GraphQLString},
                durum: {
                    type: new GraphQLEnumType({
                        name: 'KursGuncellemeDurumlar',
                        values: {
                            'yayin': {value: 'yayında'},
                            'olus':{value:'oluşturuluyor'},
                            'plan': {value:'planlanıyor'}
                        }
                    }),
                },
            },
            resolve(parent,args){
                return Kurs.findByIdAndUpdate(args.id, {
                    $set: {
                        isim:args.isim,
                        aciklama:args.aciklama,
                        durum:args.durum
                    }
                }, {new:true})
            }
        },

        kursSil: {
            type:KursType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                return Kurs.findByIdAndDelete(args.id)
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation:RootMutation
})
