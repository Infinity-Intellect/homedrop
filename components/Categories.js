import 'isomorphic-fetch'
import { Button } from '@material-ui/core'
const onWheel = e => {
    e.preventDefault();
    const container = document.getElementById("categories");
    const containerScrollPosition = document.getElementById("categories").scrollLeft;
    container.scrollTo({
        top: 0,
        left: containerScrollPosition + e.deltaY * 30,
        behaviour: "smooth"
    });
};
const Categories = (props) => {
    return (
        <div id="categories" className="categories-menu" onWheel={onWheel}>
            {props.categories.map((category, idx) => (
                <div className="category-container" key={idx} onClick={() => {
                    props.add(category)
                }}>
                    <div style={{
                        wordWrap: "break-word",
                        width: "120px",
                        whiteSpace: "normal",
                        textAlign: "center",
                        backgroundColor: "rgb(204, 202, 202)",
                        borderRadius: "30px",
                        padding: "7%",
                    }}
                        className="category-name-container">
                        {category.name}
                    </div>
                </div>
            ))}
        </div>
    )
}
export default Categories