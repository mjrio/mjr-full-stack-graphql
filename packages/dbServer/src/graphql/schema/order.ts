/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from 'apollo-server';
import { fromGlobalId } from '../../globalId';
import { IOrder, OrderModel } from '../../models';
import { customerMapper } from '../loaders';
import { orderMapper } from '../loaders/orderLoader';
import { productMapper } from '../loaders/productLoader';
import { Resolvers } from '../types';

/* 
orders(limit: 5, offset: 0) {
  id
  orderDate
  shipAddress {
    street
    city
    region
    postalCode
    country
  }
  customer {
    id
    companyName
  }
  details {
    product {
      id
      name
      unitPrice
      category {
        name
        description
      }
    }
    unitPrice
    quantity
    discount
  }
}

*/

const typeDefs = gql`
  type Order implements Node {
    id: ID!
    orderDate: DateTime
    requiredDate: DateTime
    shippedDate: DateTime
    details: [OrderDetail]
    shipAddress: Address
    customer: Customer
  }

  type OrderDetail {
    product: Product
    unitPrice: Float
    quantity: Int
    discount: Float
  }

  extend type Query {
    orders(limit: Int, offset: Int): [Order]
  }
`;

const resolvers: Resolvers = {
  Query: {
    orders: async (_root, args) => {
      const orders = await OrderModel.find().skip(args.offset).limit(args.limit).lean<IOrder>();
      return orders.map((item) => orderMapper(item));
    },
  },
  Order: {
    customer: async (order, args, context) => {
      const { id } = fromGlobalId(order.customer.id);
      const customer = await context.loaders.customer.load(id);
      return customerMapper(customer) as any;
    },
  },
  OrderDetail: {
    product: async (orderDetail, args, context) => {
      const { id } = fromGlobalId(orderDetail.product.id);
      const product = await context.loaders.product.load(id);
      // const product = await ProductModel.findOne({ productID: +id }).lean<IProduct>();
      return productMapper(product) as any;
    },
  },
};

export { typeDefs, resolvers };