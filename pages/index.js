import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import Categories from '../components/Categories'
import Products from '../components/Products'
import { Button, Snackbar } from '@material-ui/core'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import Alert from '@material-ui/lab/Alert'
import 'isomorphic-fetch'
let selCategoriesSet = []
const Index = (props) => {
    const [searchProduct, setSearchProduct] = useState("")
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [pagination, setPagination] = useState({})
    const [snackbarState, setSnackbar] = useState({
        open: false,
        message: "",
        vertical: 'top',
        horizontal: 'center'
    })
    const fetchProdcuts = async () => {
        let res = await fetch('https://api.homedrop.in/products')
        const products_data = await res.json()
        setProducts(products_data.body)
    }

    const fetchCategories = async () => {
        let res = await fetch(`https://api.homedrop.in/categories`)
        const categories_data = await res.json()
        setCategories(categories_data.data)
    }

    const setText = async (query) => {
        console.log(query)
        if (query != "") {
            fetch(`https://api.homedrop.in/products?search=${query}`).then(res => res.json()).then(data => {
                setProducts(data.body)

            }).catch(err => {
                console.log(err)
            })
        }
        else {
            fetchProdcuts()
        }
    }

    const debounce = function (callback, time) {
        let timer;
        return function () {
            let context = this, args = arguments
            clearTimeout(timer)
            timer = setTimeout(() => {
                callback.apply(context, arguments)
            }, time)
        }
    }

    const addSelectedCategory = async (category) => {
        let res = await fetch(`https://api.homedrop.in/products?category=${category.id}`)
        let data = await res.json()
        if (data.code === "success") {
            if (selCategoriesSet.indexOf(category.id) === -1) {
                selCategoriesSet.push(category.id)
                setSelectedCategories(previous => [...previous, category])
            }
            if (selCategoriesSet.length === 1) {
                setProducts(data.body)
            }
            else if (selCategoriesSet.length > 1) {
                setProducts(prev => [...prev, ...data.body])
            }
            console.log(data.body)
        }
        else {
            setSnackbar({ ...snackbarState, open: true, message: "Category does not exist" })
        }
    }
    const clearSelectedCategories = () => {
        setSelectedCategories([])
        selCategoriesSet = []
        fetchProdcuts()
    }

    const updateCategoryPagination = (direction) => {
        if (direction === -1) {
            if (pagination.startIndex > 0) {
                setPagination({ ...pagination, startIndex: pagination.startIndex - pagination.limit, endIndex: pagination.endIndex - pagination.limit })
            }
        }
        else if (direction === 1) {
            if (pagination.endIndex + pagination.limit < categories.length) {
                setPagination({ ...pagination, startIndex: pagination.startIndex + pagination.limit, endIndex: pagination.endIndex + pagination.limit })
            }
        }
    }

    const handleSnackbarClose = () => {
        setSnackbar({
            open: false,
            vertical: 'top',
            horizontal: 'center'
        })
    }
    useEffect(() => {
        fetchProdcuts()
        fetchCategories()
        setPagination({
            limit: 3,
            startIndex: 0,
            endIndex: 3
        })
    }, [])
    return (
        <div className="container">
            <Snackbar
                open={snackbarState.open}
                onClose={handleSnackbarClose}
                message={snackbarState.message}
            />
            <div className="header-container">
                <h1>HomeDrop</h1>
            </div>
            <div className="searchbar-container">
                <SearchBar setText={debounce(setText, 300)} />
            </div>
            <div className="categories-container">
                <div className="pagination-container">
                    <Button variant="contained" color="primary" onClick={() => { updateCategoryPagination(-1) }}>
                        <KeyboardArrowLeftIcon />
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => { updateCategoryPagination(1) }}>
                        <KeyboardArrowRightIcon />
                    </Button>
                </div>
                <Categories categories={categories.slice(pagination.startIndex, pagination.endIndex)}
                    add={addSelectedCategory} />
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <h3>Page {pagination.endIndex / pagination.limit} of {(categories.length / pagination.limit) - 1}</h3>
                </div>
                <div className="selected-categories">
                    {selectedCategories.length === 0 ?
                        <Alert severity="success" style={{ width: "15%" }}>All</Alert>
                        : selectedCategories.map((category, idx) => (
                            <Alert key={idx} severity="success" style={{ width: "15%" }}>{category.name}</Alert>
                        ))}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" color="secondary" onClick={clearSelectedCategories}
                    >Clear Selection</Button>
                </div>
            </div>
            <div className="products-container">
                <Products products={products} query={searchProduct} limit={5} />
            </div>
        </div>
    )
}
export default Index