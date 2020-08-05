import 'isomorphic-fetch'
import { useState, useEffect } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontSize: 18
    },
}))(TableCell);
const Products = (props) => {
    return (
        <div>
            <TableContainer component={Paper}>
                <Table >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell><b>S.No</b></StyledTableCell>
                            <StyledTableCell><b>Product</b></StyledTableCell>
                            <StyledTableCell><b>Slug</b></StyledTableCell>
                            <StyledTableCell><b>In Stock</b></StyledTableCell>
                            <StyledTableCell><b>Product Name</b></StyledTableCell>
                            <StyledTableCell><b>Product Type</b></StyledTableCell>
                            <StyledTableCell><b>Min Quantity</b></StyledTableCell>
                            <StyledTableCell><b>Price(&#8377;)</b></StyledTableCell>
                            <StyledTableCell><b>Metrics Label</b></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.products ? props.products.filter(product => {
                            return product.name.toLowerCase().indexOf(props.query.toLowerCase()) !== -1
                        }).map((product, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>
                                    <a href={product.thumbnail} target="_blank">
                                        <img src={product.thumbnail} width="50px"></img>
                                    </a>
                                </TableCell>
                                <TableCell>{product.slug}</TableCell>
                                <TableCell>{product.out_of_stock ? <CancelIcon style={{ color: "red" }} /> : <CheckCircleIcon style={{ color: "green" }} />}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.product_type}</TableCell>
                                <TableCell>{product.minimum_quantity ? product.minimum_quantity : "-"}</TableCell>
                                <TableCell>{product.price ? product.price : "-"}</TableCell>
                                <TableCell>{product.metrics_label ? product.metrics_label : "-"}</TableCell>
                            </TableRow>
                        )) : <h1>No matching product !</h1>}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>

    )
}
Products.getInitialProps = async () => {
    const res = await fetch('https://api.homedrop.in/categories')
    const data = await res.json()
    return { data: data.body }
}
export default Products