import * as React from 'react';
import { config } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import { SideNav, LayoutSidebar, Responsive, CardProduct, Pagination, InputText, Pill } from 'upkit';
import TopBar from '../../components/TopBar';
import menus from './menus';
import { fetchProducts, setPage, goToNextPage, goToPrevPage, setKeyword, setCategory, toggleTag } from '../../features/Products/actions';
import BounceLoader from 'react-spinners/BounceLoader';
import { tags } from './tags';

export default function Home(){

    let dispatch = useDispatch();
    let products = useSelector(state => state.products);
    React.useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch, products.currentPage,  products.keyword, products.category, products.tags])

    return (
        <div>
            <LayoutSidebar 
                sidebar={<SideNav color="blue" items={menus} verticalAlign="top" onChange={category => dispatch(setCategory(category))}/>}
                content={
                    <div className="md:flex md:flex-row-reverse w-full mr-5 h-full min-h-screen">
                        <div className="w-full md:w-3/4 pl-5 pb-10">
                            <TopBar/>
                            <div className="w-full text-center mb-6 mt-5" style={{'marginTop': '10px'}}>
                                <InputText
                                    value={products.keyword}
                                    placeholder="cari makanan favoritmu..."
                                    fitContainer
                                    onChange={e => {
                                        dispatch(setKeyword(e.target.value))
                                    }}
                                />
                            </div>
                            <div className="flex mt-6" style={{'marginTop': '10px'}}>
                                {tags[products.category].map((tag, index) => {
                                    return (
                                        <div key={index}>
                                            <Pill
                                                text={tag}
                                                icon={tag.slice(0,1).toUpperCase()}
                                                isActive={products.tags.includes(tag)}
                                                onClick={_ => dispatch(toggleTag(tag))}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                            {
                                products.status === 'process' && !products.data.length ? 
                                <div className="flex justify-center">
                                    <BounceLoader color="blue"/> 
                                </div>
                                : 
                                null
                            }
                            <Responsive desktop={3} items="stretch">
                                {products.data.map((product, index) => {
                                    return (
                                        <div key={index} className="p-2">
                                            <CardProduct color="blue"
                                                title={product.name}
                                                imgUrl={`${config.api_host}/upload/${product.image_url}`}
                                                price={product.price}
                                                onAddToCart={_ => null}
                                            />
                                        </div>
                                    )
                                })}
                            </Responsive>
                            <div className="text-center my-10">
                                <Pagination color="blue"
                                    totalItems={products.totalItems} 
                                    page={products.currentPage}
                                    perPage={products.perPage}
                                    onChange={page => dispatch(setPage(page))}
                                    onNext={_ => dispatch(goToNextPage())}
                                    onPrev={_ => dispatch(goToPrevPage())}
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-1/4 h-full shadow-lg border-r border-white bg-gray-100">
                            Keranjang belanja di sini
                        </div>
                    </div>
                }
                sidebarSize={80}
            />
        </div>
    )
}