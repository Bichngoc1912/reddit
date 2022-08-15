require('dotenv').config();

import 'reflect-metadata'
import express from 'express';
import { createConnection } from "typeorm";
import { User } from './entities/User';
import { Post } from './entities/Post';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ApolloServerPluginLandingPageGraphQLPlayground, Context } from 'apollo-server-core';
import { UserResolver } from './resolvers/user';
import { HelloResolver } from './resolvers/hello';

const PORT_SERVER = 4000;
const PORT_DB = 5432;
const NODE_ENV_DB_USERNAME = "bngoc"
const NODE_ENV_BD_PASSWORD = "191298"

const main = async () => {
  await createConnection({
    type: 'postgres',
    database: 'reddit',
    port: PORT_DB, 
    username: NODE_ENV_DB_USERNAME,
    password: NODE_ENV_BD_PASSWORD,
    logging: true,
    synchronize: true,
    entities: [User, Post]
  });

  const app = express();

  const apolloExcute = async () => {
    const apolloServer = new ApolloServer({
      schema: await buildSchema({ resolvers: [HelloResolver, UserResolver], validate: false }),
      context: ({ req, res }): Context => ({ req, res }),
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
    });
  
    await apolloServer.start();
  
    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(PORT_SERVER, () => console.log(`Server starting on port ${PORT_SERVER}${apolloServer.graphqlPath}`));
  }
  apolloExcute();
}

main().catch((err: any) => console.log(err.message))

