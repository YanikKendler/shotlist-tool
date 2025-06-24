import "./skeleton.scss"

export default function Skeleton({ width, height }: { width?: string; height?: string;}) {
    return (
        <div
            className={`skeleton`}
            style={{ width: width || '100%', height: height || '100%' }}
        ></div>
    );
}