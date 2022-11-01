const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType}= require('graphql');
const User=require('../models/User');
const UserType= new GraphQLObjectType({
    name:'User',
    fields:()=>({
        id:{type:GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
        gender: {type: GraphQLString},
        image:{type: GraphQLString}
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        users:{
            type: new GraphQLList( UserType),
            resolve(parent,args){
                return User.find();
            },
        },
        user: {
            type: UserType,
            args: { name: { type: GraphQLString } },
            resolve(parent, args) {
                console.log(args.name)
              return User.find(
                { $text: { $search:args.name} },
                { score: { $meta: "textScore" } }
              ).sort({ score: { $meta: "textScore" } });
            },
        },
    },
});
const mutation =  new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addUser:{
            type: UserType,
            args:{
                name:{type:GraphQLNonNull(GraphQLString)},
                email:{type:GraphQLNonNull(GraphQLString)},
                phone:{type:GraphQLNonNull(GraphQLString)},
                gender:{type: new GraphQLEnumType({
                    name:'UserGender',
                    values:{
                        Male:{value:'Male'},
                        Female:{value:'Female'}
                    }
                })},
                image:{type:GraphQLNonNull(GraphQLString)},
            },
            resolve(parent,args){
                const user= new User({
                    
                    name:args.name,
                    email:args.email,
                    phone: args.phone,
                    gender: args.gender,
                    image:args.image
                });
                return user.save();
            }
        },

        deleteUser:{
            type: UserType,
            args:{
                id:{type:GraphQLNonNull(GraphQLID)},
            },
            resolve(parent,args){
                return User.findByIdAndRemove(args.id);
            }
        },
        updateUser:{
            type: UserType,
            args:{
                id:{type:GraphQLNonNull(GraphQLID)},
                name:{type:GraphQLString},
                email:{type:GraphQLString},
                phone:{type:GraphQLString},
                gender:{type: new GraphQLEnumType({
                    name:'UserGenderUpdate',
                    values:{
                        Male:{value:'Male'},
                        Female:{value:'Female'}
                    }
                })},
                image:{type:GraphQLString},
            },
            resolve(parent,args){
                return User.findByIdAndUpdate(
                    args.id,
                    {
                        $set:{
                            name: args.name,
                            email:args.email,
                            phone:args.phone,
                            gender:args.gender,
                            image:args.image
                        },
                    },
                    {new:true}
                );
            }
        },
        
    }
});
module.exports= new GraphQLSchema({
    query: RootQuery,
    mutation
})