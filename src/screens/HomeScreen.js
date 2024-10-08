import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {

      try {
        const result = await axios.get('https://amazon-mern-backendd.onrender.com/api/products');
        setProducts(result.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div >
      <Helmet>
        <title>Amazon</title>
      </Helmet>
      <div className='w-full flex justify-center'>
        <h1 className="mb-4 text-[#e2e8f0] text-2xl">Featured Products</h1>
      </div>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug}>
                <div className='mb-3 w-full flex justify-start flex-wrap'>
                  <Product product={product} />
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
