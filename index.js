import * as THREE from 'three';
import metaversefile from 'metaversefile'
import Terrain from './terrain.js';

const { useFrame, useLocalPlayer, useLoaders, useUi, usePhysics, useCleanup } = metaversefile;



export default () => {
    const physics = usePhysics();

    const rootScene = new THREE.Object3D();
    const terrain = new Terrain(physics);
    rootScene.add(terrain);

    let physicsIds = [];
    // terrain.children.forEach(mesh => {
    //     const physicsId = physics.addGeometry(mesh)
    //     physicsIds.push(physicsId);
    // });
    const physicsId = physics.addGeometry(terrain)
    physicsIds.push(physicsId);

    useCleanup(() => {
        for (const physicsId of physicsIds) {
            physics.removeGeometry(physicsId);
        }
    });

    const player = useLocalPlayer();
    const nextPosition = player.position.clone();
    terrain.updateView(player.position);
    const diffDis = 20;

    useFrame(() => {
        if (nextPosition.distanceTo(player.position) > diffDis) {
            nextPosition.copy(player.position);
            terrain.updateView(player.position, () => {
                for (const physicsId of physicsIds) {
                    physics.removeGeometry(physicsId);
                }    
                physicsIds = [];
                const physicsId = physics.addGeometry(terrain)
                physicsIds.push(physicsId);
            });
        }
    });
    rootScene.add(new THREE.AxesHelper(1000))

    return rootScene;
}