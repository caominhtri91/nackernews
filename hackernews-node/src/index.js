const { GraphQLServer } = require('graphql-yoga');

const links = [
  {
    id: 'link-0',
    url: 'www.google.com',
    description: 'Hello world'
  }
];
let idCount = links.length;

// Resolver object is the actual implementation of the graphql schema
// Its structure is indentical to the structure of the type definition
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) => links[args.id]
  },
  Mutation: {
    post: (root, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      };

      links.push(link);
      return link;
    },
    updateLink: (root, args) => {
      args.id = args.id.replace('link-', '');
      links[args.id].url = args.url;
      links[args.id].description = args.description;

      return links[args.id];
    },
    deleteLink: (root, args) => {
      args.id = args.id.replace('link-', '');
      link = links[args.id];
      links.splice(args.id, 1);

      return link;
    }
  }
};

// The schema and resolvers are bundled and passed to the GraphqlServer
// This tell the server what API operations are accepted and how they
// should be resolved
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
});

server.start(() => console.log(`Server is running on port 4000`));
