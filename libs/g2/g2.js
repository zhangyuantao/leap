var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * g2(geometry2D) 2D几何功能库
 * 提供多边形碰撞等功能
 * Created by zhangyuantao 2018.8
 */
var g2;
(function (g2) {
    /**
     * 2维向量
     */
    var Vector2 = (function () {
        function Vector2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var self = this;
            self.x = x;
            self.y = y;
        }
        Object.defineProperty(Vector2.prototype, "length", {
            // 向量长度
            get: function () {
                var self = this;
                return Math.sqrt(self.x * self.x + self.y * self.y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "normalize", {
            // 规则化
            get: function () {
                var self = this;
                var len = self.length;
                return new Vector2(self.x / len, self.y / len);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "normLine", {
            // 获取法线向量
            get: function () {
                var self = this;
                return new Vector2(self.y, -self.x);
            },
            enumerable: true,
            configurable: true
        });
        // 两个向量是否相等
        Vector2.equals = function (v1, v2) {
            return v1.x == v2.x && v1.y == v2.y;
        };
        // 两个向量的距离
        Vector2.distance = function (v1, v2) {
            var dx = v1.x - v2.x;
            var dy = v1.y - v2.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        // 两个向量相加
        Vector2.add = function (v1, v2) {
            return new Vector2(v1.x + v2.x, v1.y + v2.y);
        };
        // 两个向量相减 v1 - v2
        Vector2.substract = function (v1, v2) {
            return new Vector2(v1.x - v2.x, v1.y - v2.y);
        };
        // 点积
        Vector2.dot = function (v1, v2, normalized) {
            if (normalized === void 0) { normalized = false; }
            // 归一化
            var v11 = normalized ? v1.normalize : v1;
            var v22 = normalized ? v2.normalize : v2;
            return v11.x * v22.x + v11.y * v22.y;
        };
        // 获取v在法线上的投影长度
        Vector2.projection = function (v, normLine) {
            return Vector2.dot(v, normLine) / normLine.length;
        };
        return Vector2;
    }());
    g2.Vector2 = Vector2;
    __reflect(Vector2.prototype, "g2.Vector2");
})(g2 || (g2 = {}));
var g2;
(function (g2) {
    var SAT;
    (function (SAT) {
        /**
         * 圆形
         */
        var Circle = (function () {
            function Circle(r) {
                this.type = "Circle";
                var self = this;
                self.r = r;
                self.x = 0;
                self.y = 0;
                self.scaleX = 1;
                self.scaleY = 1;
                self.rotation = 0;
            }
            // 缩放后的半径
            Circle.prototype.getRadius = function () {
                var self = this;
                return self.r * self.scaleX;
            };
            /**
             * 获取图形在法线上的投影范围
             */
            Circle.prototype.getProjection = function (normLine) {
                var self = this;
                var center = new g2.Vector2(self.x, self.y);
                var pro = g2.Vector2.projection(center, normLine);
                var realR = self.getRadius();
                return { min: pro - realR, max: pro + realR };
            };
            return Circle;
        }());
        SAT.Circle = Circle;
        __reflect(Circle.prototype, "g2.SAT.Circle", ["g2.SAT.IShape"]);
    })(SAT = g2.SAT || (g2.SAT = {}));
})(g2 || (g2 = {}));
var g2;
(function (g2) {
    var SAT;
    (function (SAT) {
        /**
         * 凸多边形
         */
        var Polygon = (function () {
            function Polygon(vertices) {
                this.type = "Polygon";
                var self = this;
                self.originVertices = vertices;
                self.x = 0;
                self.y = 0;
                self.scaleX = 1;
                self.scaleY = 1;
                self.rotation = 0;
            }
            /**
             * 获取变换后的顶点坐标，遵循顺序：缩放 => 旋转 => 平移
             */
            Polygon.prototype.getVerticesCoordinate = function () {
                var self = this;
                if (self.scaleX == 1 && self.scaleY == 1 && self.rotation % 360 == 0)
                    return self.originVertices;
                var result = [];
                var list = self.originVertices;
                for (var i = 0, len = list.length; i < len; i++) {
                    var coord = list[i];
                    var newCoord = new g2.Vector2();
                    // 1.缩放
                    newCoord.x = coord.x * self.scaleX;
                    newCoord.y = coord.y * self.scaleY;
                    // 2.旋转：旋转关系转换： x1 = x * cos(b) – y * sin(b); y1 = x * sin(b) + y * cos(b)
                    var angle = self.rotation / 180 * Math.PI;
                    var x = newCoord.x * Math.cos(angle) - newCoord.y * Math.sin(angle);
                    var y = newCoord.x * Math.sin(angle) + newCoord.y * Math.cos(angle);
                    newCoord.x = x;
                    newCoord.y = y;
                    // 3.平移：加上自身坐标偏移				
                    newCoord.x += self.x;
                    newCoord.y += self.y;
                    result.push(newCoord);
                }
                return result;
            };
            /**
             * 获取边
             */
            Polygon.prototype.getSides = function () {
                var self = this;
                var list = self.getVerticesCoordinate();
                var len = list.length;
                var result = [];
                if (len >= 3) {
                    for (var j = 1, pre = list[0]; j < len; j++) {
                        var p = list[j];
                        result.push(g2.Vector2.substract(p, pre));
                        pre = p;
                    }
                    result.push(g2.Vector2.substract(list[0], list[len - 1]));
                }
                return result;
            };
            /**
             * 获取与目标点最近的顶点
             */
            Polygon.prototype.getNearestPoint = function (point) {
                var self = this;
                var list = self.getVerticesCoordinate();
                var nearestP = list[0];
                var minDis = g2.Vector2.distance(point, nearestP);
                for (var i = 1, l = list.length; i < l; i++) {
                    var p = list[i];
                    var d = g2.Vector2.distance(point, p);
                    if (d < minDis) {
                        minDis = d;
                        nearestP = p;
                    }
                }
                return nearestP;
            };
            /**
             * 获取图形在法线上的投影范围
             */
            Polygon.prototype.getProjection = function (normLine) {
                var self = this;
                var list = self.getVerticesCoordinate();
                var min, max;
                for (var i = 0, l = list.length; i < l; i++) {
                    var p = list[i];
                    var pro = g2.Vector2.projection(p, normLine);
                    if (!min || pro < min)
                        min = pro;
                    if (!max || pro > max)
                        max = pro;
                }
                return { min: min, max: max };
            };
            return Polygon;
        }());
        SAT.Polygon = Polygon;
        __reflect(Polygon.prototype, "g2.SAT.Polygon", ["g2.SAT.IShape"]);
    })(SAT = g2.SAT || (g2.SAT = {}));
})(g2 || (g2 = {}));
/**
 * SAT(SeparatingAxisTheorem)
 * 分离轴定理，是一个判断两个凸多边形是否碰撞的理论
 * Created by 张元涛 2018.8
 */
var g2;
(function (g2) {
    var SAT;
    (function (SAT) {
        /**
         * 检测两个图形是否发生碰撞
         */
        SAT.checkCollision = function (shapeA, shapB) {
            var result = false;
            if (shapeA.type == "Polygon" && shapB.type == "Polygon") {
                result = SATTest.polygonsCollision(shapeA, shapB);
            }
            else if (shapeA.type == "Circle" && shapB.type == "Circle") {
                result = SATTest.circlesCollision(shapeA, shapB);
            }
            else {
                var c = void 0, p = void 0;
                if (shapeA.type == "Circle") {
                    c = shapeA;
                    p = shapB;
                }
                else {
                    c = shapB;
                    p = shapeA;
                }
                result = SATTest.circlePolygonCollision(c, p);
            }
            return result;
        };
        /**
         * 几何碰撞检测工具
         * 只支持凸多边形和圆形，凹多边形和线段不在此考虑范畴
         * Created by zhangyuantao
         */
        var SATTest = (function () {
            function SATTest() {
            }
            /**
             * 多边形碰撞
             */
            SATTest.polygonsCollision = function (a, b) {
                var sides = a.getSides().concat(b.getSides());
                var norms = [];
                // 得到两个图形所有边的法线
                for (var i = 0, l = sides.length; i < l; i++)
                    norms.push(sides[i].normLine);
                for (var i = 0, len = norms.length; i < len; i++) {
                    var n = norms[i];
                    // 减少运算，过滤平行轴
                    var bool = SATTest.filterCal(n, norms, i);
                    if (bool)
                        continue;
                    var proA = a.getProjection(n);
                    var proB = b.getProjection(n);
                    if (!SATTest.isOverlay(proA, proB))
                        return false;
                }
                return true;
            };
            // 圆形碰撞
            SATTest.circlesCollision = function (a, b) {
                var normLine = new g2.Vector2(a.x - b.x, a.y - b.y);
                // let proA = a.getProjection(normLine);
                // let	proB = b.getProjection(normLine);
                // if (CollisionUtils.isOverlay(proA, proB))
                // 	return false;			
                // return true;
                return normLine.length <= (a.getRadius() + b.getRadius()); // 更为简单的圆心距离与半径关系检测法
            };
            SATTest.circlePolygonCollision = function (c, p) {
                var sides = p.getSides();
                var norms = [];
                for (var i = 0, l = sides.length; i < l; i++)
                    norms.push(sides[i].normLine);
                var np = p.getNearestPoint(new g2.Vector2(c.x, c.y));
                norms.push(new g2.Vector2(np.x - c.x, np.y - c.y));
                for (var i = 0, len = norms.length; i < len; i++) {
                    var n = norms[i];
                    // 减少运算，过滤平行轴
                    var bool = SATTest.filterCal(n, norms, i);
                    if (bool)
                        continue;
                    var proA = c.getProjection(n);
                    var proB = p.getProjection(n);
                    if (!SATTest.isOverlay(proA, proB))
                        return false;
                }
                return true;
            };
            // 投影线段是否相交
            SATTest.isOverlay = function (proA, proB) {
                var min, max;
                if (proA.min < proB.min)
                    min = proA.min;
                else
                    min = proB.min;
                if (proA.max > proB.max)
                    max = proA.max;
                else
                    max = proB.max;
                return (proA.max - proA.min) + (proB.max - proB.min) > max - min;
            };
            // 减少运算，过滤平行轴
            SATTest.filterCal = function (n, norms, curCheckIdx) {
                var bool = false;
                for (var j = 0; j < curCheckIdx; j++) {
                    var dot = g2.Vector2.dot(n, norms[j], true);
                    if (Math.abs(dot) == 1) {
                        bool = true;
                        break;
                    }
                }
                return bool;
            };
            return SATTest;
        }());
        SAT.SATTest = SATTest;
        __reflect(SATTest.prototype, "g2.SAT.SATTest");
    })(SAT = g2.SAT || (g2.SAT = {}));
})(g2 || (g2 = {}));
