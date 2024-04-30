//namespace Weaver {

//    export class TestLevel extends Level {

//        private m_ParentEntity: Entity;
//        private m_ParentSprite: SpriteComponent;

//        private m_TestEntity: Entity;
//        private m_TestSprite: SpriteComponent;

//        public load(): void {
//            this.m_ParentEntity = new Entity(0, "parentEntity");
//            this.m_ParentSprite = new SpriteComponent("test", "checkerboard");
//            this.m_ParentEntity.addComponent(this.m_ParentSprite);
//            this.m_ParentEntity.transform.position.x = 300;
//            this.m_ParentEntity.transform.position.y = 300;

//            this.m_TestEntity = new Entity(1, "testEntity");
//            this.m_TestSprite = new SpriteComponent("test", "checkerboard");
//            this.m_TestEntity.addComponent(this.m_TestSprite);
//            this.m_TestEntity.transform.position.x = 120;
//            this.m_TestEntity.transform.position.y = 120;

//            this.m_ParentEntity.addChild(this.m_TestEntity);
//            this.scene.addEntity(this.m_ParentEntity);

//            super.load();
//        }

//        public update(time: number): void {
//            this.m_ParentEntity.transform.rotation.z += 0.01;
//            this.m_TestEntity.transform.rotation.z += 0.01;

//            super.update(time);
//        }
//    }
//}