import { QRCodeSVG } from 'qrcode.react';

export default function QRCode({ value, size = 180 }) {
    return (
        <div style={{
            background: 'white',
            padding: '12px',
            borderRadius: '20px',
            display: 'inline-block',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
        }}>
            <QRCodeSVG
                value={value}
                size={size}
                level="H" // Nivel de corrección de errores alto
                includeMargin={false}
                imageSettings={{
                    // Opcional: Puedes poner un logo pequeñito en el centro
                    src: "/logo-min.png", 
                    x: undefined,
                    y: undefined,
                    height: 24,
                    width: 24,
                    excavate: true,
                }}
                fgColor="#1C1917" // Color de los módulos (el negro de tu marca)
                bgColor="#FFFFFF"
            />
        </div>
    );
}