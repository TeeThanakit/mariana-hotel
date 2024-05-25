import classes from './all-posts.module.css'
import PostsGrid from './posts-grid'

export default function AllPosts(props){
    return <section className={classes.posts}>
        <h2 className='text-center text-2xl'>All Customer messages</h2>
        <PostsGrid posts={props.contact}/>
    </section>
}