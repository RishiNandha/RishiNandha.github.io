import { useParams } from "react-router";

const MdToBlog = () => {
    const post = useParams().post;
    return (
        <div>
            <h1>Requested post is {post}</h1>
        </div>
    );
}

export default MdToBlog;