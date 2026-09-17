import Lanyard from './Lanyard';

function App() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'transparent',
      overflow: 'hidden',
    }}>
      <Lanyard
        position={[0, 0, 20]}
        gravity={[0, -40, 0]}
        fov={20}
        transparent={true}
        frontImage={`${import.meta.env.BASE_URL}image.png`}
        backImage={`${import.meta.env.BASE_URL}image.png`}
        imageFit="cover"
      />
    </div>
  );
}

export default App;
