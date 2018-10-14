/**
 * g2(geometry2D) 2D几何功能库
 * 提供多边形碰撞等功能
 * Created by zhangyuantao 2018.8
 */
declare namespace g2 {
    /**
     * 2维向量
     */
    class Vector2 {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        readonly length: number;
        readonly normalize: Vector2;
        readonly normLine: Vector2;
        static equals(v1: Vector2, v2: Vector2): boolean;
        static distance(v1: Vector2, v2: Vector2): number;
        static add(v1: Vector2, v2: Vector2): Vector2;
        static substract(v1: Vector2, v2: Vector2): Vector2;
        static dot(v1: Vector2, v2: Vector2, normalized?: boolean): number;
        static projection(v: Vector2, normLine: Vector2): number;
    }
}
declare namespace g2.SAT {
    /**
     * 圆形
     */
    class Circle implements IShape {
        type: string;
        r: number;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        constructor(r: number);
        getRadius(): number;
        /**
         * 获取图形在法线上的投影范围
         */
        getProjection(normLine: g2.Vector2): {
            min: number;
            max: number;
        };
    }
}
declare namespace g2.SAT {
    /**
     * 形状碰撞器接口
     */
    interface ICollider {
        isCollided: boolean;
        collider: g2.SAT.IShape;
        initCollider(...args: any[]): any;
        drawCollider(): any;
        updateTransform(): any;
    }
}
declare namespace g2.SAT {
    interface IShape {
        type: string;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        getProjection(normLine: g2.Vector2): any;
    }
}
declare namespace g2.SAT {
    /**
     * 凸多边形
     */
    class Polygon implements IShape {
        type: string;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        originVertices: g2.Vector2[];
        constructor(vertices: g2.Vector2[]);
        /**
         * 获取变换后的顶点坐标，遵循顺序：缩放 => 旋转 => 平移
         */
        getVerticesCoordinate(): Vector2[];
        /**
         * 获取边
         */
        getSides(): Vector2[];
        /**
         * 获取与目标点最近的顶点
         */
        getNearestPoint(point: g2.Vector2): Vector2;
        /**
         * 获取图形在法线上的投影范围
         */
        getProjection(normLine: g2.Vector2): {
            min: any;
            max: any;
        };
    }
}
/**
 * SAT(SeparatingAxisTheorem)
 * 分离轴定理，是一个判断两个凸多边形是否碰撞的理论
 * Created by 张元涛 2018.8
 */
declare namespace g2.SAT {
    /**
     * 检测两个图形是否发生碰撞
     */
    let checkCollision: (shapeA: any, shapB: any) => boolean;
    /**
     * 几何碰撞检测工具
     * 只支持凸多边形和圆形，凹多边形和线段不在此考虑范畴
     * Created by zhangyuantao
     */
    class SATTest {
        /**
         * 多边形碰撞
         */
        static polygonsCollision(a: Polygon, b: Polygon): boolean;
        static circlesCollision(a: Circle, b: Circle): boolean;
        static circlePolygonCollision(c: Circle, p: Polygon): boolean;
        private static isOverlay(proA, proB);
        private static filterCal(n, norms, curCheckIdx);
    }
}
