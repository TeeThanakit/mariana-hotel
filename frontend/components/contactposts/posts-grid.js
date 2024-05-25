import Postsitem from "./post-item";
import classes from "./posts-grid.module.css";

export default function PostsGrid(props) {
  const { posts } = props;
  return (
    <ul className={classes.grid}>
      {posts.map((post) => (
        <Postsitem key={post.id} post={post}/>
      ))}
    </ul>
  );
}
