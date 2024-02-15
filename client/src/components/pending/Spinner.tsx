interface SpinnerProps {
    absolute?: boolean;
    height?: string;
    width?: string;
    margin?: string;
}

function Spinner({ absolute, height, width, margin }: SpinnerProps) {
    return (
        <span style={{
            ...(absolute === false) && { position: "static" },
            ...(height && width) && { height, width },
            ...(margin) && { margin }
        }} className="loader"></span>
    )
}

export default Spinner;