import { useEffect, useState } from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Modal, Typography, Rate } from "antd";
import axios from "axios";

const { Text } = Typography;

const Cards = ({
  selectedPriceRange,
  selectedBrands,
  selectedRating,
  searchQuery = '',
  setInfo,
  handleCheckout,
}) => {
  const [products, setProducts] = useState([]); // Initialize products state
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onCardClick = (product) => {
    setSelectedCard(product);
    setIsModalOpen(true);
  };

  const brandFilter = (product) => {
    if (!selectedBrands.length) {
      return true;
    }
    return selectedBrands.includes(product.company);
  };

  const ratingFilter = (product) => {
    if (!selectedRating.length) {
      return true;
    }
    return selectedRating.some(
      (rating) => parseFloat(product.star_rating) >= parseFloat(rating)
    );
  };

  const amountRangeFilter = (product) => {
    if (!selectedPriceRange.length) {
      return true;
    }
    return selectedPriceRange.some((range) => {
      const [min, max] = range.split("-");
      return (
        product.price >= parseFloat(min) && product.price <= parseFloat(max)
      );
    });
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_API_KEY || 'http://localhost:4000'}/product/get-products`)
      .then((data) => {
        setProducts(data?.data?.products || []);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  useEffect(() => {
    const productsList = products || [];
    const filtered = productsList.filter((product) => {
      return (
        amountRangeFilter(product) &&
        ratingFilter(product) &&
        brandFilter(product)
      );
    });

    setFilteredProducts(filtered);
  }, [selectedPriceRange, selectedBrands, selectedRating, products]);

  const Truncate = (string, number) => {
    if (!string) {
      return null;
    }
    if (string.length <= number) {
      return string;
    }
    return string.slice(0, number) + "...";
  };

  const handleAddToCart = (product) => {
    let productInfo = JSON.parse(localStorage.getItem("product")) || [];
    let foundDuplicate = false;

    productInfo.forEach((item) => {
      if (item.id === product.id) {
        item.quantity = (item.quantity || 0) + 1;
        foundDuplicate = true;
      }
    });

    if (!foundDuplicate) {
      productInfo.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("product", JSON.stringify(productInfo));
    setInfo(productInfo);
  };

  return (
    <section className="product">
      <div className="grid">
        {filteredProducts.length > 0 &&
          filteredProducts
            .filter((product) => 
              product.product_name && product.product_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
            .map((product) => (
              <div
                className="card"
                onClick={() => onCardClick(product)}
                key={product._id || product.id}
              >
                <img alt="PVC Conduit Pipes" src={product.image} />
                <div className="card-body">
                  <h5
                    className="card-title"
                    title={
                      product.product_name.length >= 50
                        ? product.product_name
                        : null
                    }
                  >
                    {Truncate(product.product_name, 55)}
                  </h5>
                  <div>
                    <strong>{product.company}</strong>
                  </div>
                  <p className="card-description">
                    {Truncate(product.description, 55)}
                  </p>
                  <p className="card-price">₹{product.price}</p>
                  <div className="card-rating">
                    <Rate allowHalf value={product.star_rating} disabled={true} />
                  </div>
                  <p>Available stock : {product.stock}</p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      style={{ backgroundColor: "#FFDE00" }}
                      icon={<ShoppingCartOutlined />}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      onClick={() => handleCheckout([product])}
                      style={{ backgroundColor: "orange" }}
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        <Modal
          title={<Text>{selectedCard?.product_name}</Text>}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button
              onClick={() => handleAddToCart(selectedCard)}
              style={{ backgroundColor: "#FFDE00" }}
              icon={<ShoppingCartOutlined />}
            >
              Add to Cart
            </Button>,
            <Button
              onClick={() => handleCheckout([selectedCard])}
              style={{ backgroundColor: "orange" }}
            >
              Buy Now
            </Button>,
          ]}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="modal-parentimg">
              <img
                className="modal-img"
                alt="PVC Conduit Pipes"
                src={selectedCard?.image}
              />
            </div>
            <div style={{ display: 'flex', width: '100%' }}>
              <Text strong style={{ width: '18.5%' }}>
                Brand :
              </Text>
              <Text style={{ width: '50%', textAlign: 'left' }}>
                {selectedCard?.company}
              </Text>
            </div>
            <div style={{ display: 'flex', width: '100%' }}>
              <Text strong style={{ width: '50%' }}>
                Description :
              </Text>
              <Text>{selectedCard?.description}</Text>
            </div>
            <div style={{ display: 'flex', width: '100%' }}>
              <Text strong style={{ width: '18.5%' }}>
                Price :
              </Text>
              <Text>₹{selectedCard?.price}</Text>
            </div>
            <div style={{ display: 'flex', width: '100%' }}>
              <Text strong style={{ width: '18.5%' }}>
                Rating :
              </Text>
              <div>
                <Rate allowHalf value={selectedCard?.star_rating} disabled={true} />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </section>
  );
};

export default Cards;
