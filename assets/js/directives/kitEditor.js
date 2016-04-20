module.exports = [
    'd3Factory', '$q', '$window',
    function (d3Factory, $q, $window) {

        return {
            scope: true, //модель унаследована от родителя
            restrict: 'AE', //A- attribute(class=), E - element(<kit/>)

            //$elem - обёрнут в jqLite
            link: function($scope, $element, $attrs){
                d3Factory.d3().then(function(d3){

                    $scope.editor = {};

                    //@param pt = конечная точка
                    $scope.editor.translateTo = function(pt){
                        var d = $q.defer();
                        var DURATION = 2000;
                        d.notify('About to start transfer');


                        function translateToInternal(){
                            $scope.editor.behavior.d3.zoom.translate([x,y]);
                            $scope.editor.behavior.d3.zoom.event($scope.editor.svg.container); // refresh page
                            $scope.editor.position.x = x;
                            $scope.editor.position.y = y;
                        }

                        d3.transition()
                            .duration(DURATION)
                            .tween("translateTo", function() {
                                var step = d3.interpolate([$scope.editor.position.x,  $scope.editor.position.y],[pt.x, pt.y]);
                                //step(0)[0] ->  $scope.editor.position.x
                                //step(0)[1] ->  $scope.editor.position.y
                                //step(1)[0] ->  pt.x
                                //step(1)[1] ->  pt.y



                                //t = 0->1
                                return function(t){
                                    translateToInternal(step(t)[0], step(t)[1]);

                                }
                            }).each("end", function () {
                                d.resolve('Translate to (' + pt.x + ';' + pt.y + ') successfully');
                            });
                        return d.promise;

                    };
                    $scope.editor.center = function(){

                        var center = {
                            x: 0,
                            y: 0
                        };
                        return $scope.editor.translateTo(center);

                    };


                    $scope.editor.behavior = {};
                    $scope.editor.behavior.d3 = {};

                    $scope.editor.grid ={};
                    $scope.editor.grid.visibility = true;
                    $scope.editor.grid.sizeXmm = 5;
                    $scope.editor.grid.sizeYmm = 5;

                    $scope.editor.features = {};

                    $scope.editor.position = {};
                    $scope.editor.position.x = 0;
                    $scope.editor.position.y = 0;

                    $scope.editor.pageProperties = {};
                    $scope.editor.pageProperties.widthMm = 297;
                    $scope.editor.pageProperties.heighMm = 210;

                    $scope.editor.svg = {};
                    $scope.editor.svg.rootNode = d3.select($element[0]).append('svg')
                        .attr("id", "svg-editor");

                    $scope.editor.features.pixelPerMmX = 1 / $scope.editor.svg.rootNode.node().screenPixelToMillimeterX;
                    $scope.editor.features.pixelPerMmY = 1 / $scope.editor.svg.rootNode.node().screenPixelToMillimeterY;

                    var g = $scope.editor.svg.rootNode
                        .append("g")
                        .attr("transform", "translate(0,0)");

                    $scope.editor.svg.underlay = g.append("rect")
                        .attr("class", "underlay")
                        .attr("width", "100%")
                        .attr("height", "100%");

                    $scope.editor.svg.container = g.append("g")
                        .attr("class", "svg-container");

                    var gGridX = $scope.editor.svg.container.append("g")
                        .attr("class", "x axis");
                    var gGridY = $scope.editor.svg.container.append("g")
                        .attr("class", "y axis");

                    var borderFrame = $scope.editor.svg.container.append("rect")
                        .attr("class", "svg-border")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", 10)
                        .attr("height", 10);

                    var DURATION = 800;
                    if( $scope.editor.grid.visibility){

                        var pageWidth = $scope.editor.features.pixelPerMmX *
                            $scope.editor.pageProperties.widthMm;
                        var pageHeigth = $scope.editor.features.pixelPerMmY *
                            $scope.editor.pageProperties.heighMm;
                        borderFrame
                            .transition()
                            .duration(DURATION)
                            .attr("width", pageWidth)
                            .attr("height", pageHeigth);

                        var lineY = gGridY.selectAll("line")
                            .data(d3.range(0, pageWidth, $scope.editor.grid.sizeXmm *
                                $scope.editor.features.pixelPerMmX));

                        lineY.enter().append("line")
                            .attr("x1", function(d){return d;})
                            .attr("y1", 0)
                            .attr("y2", 0)
                            .transition()
                            .duration(DURATION)
                            .attr("x2", function(d){return d;})
                            .attr("y2", pageHeigth);

                        var lineX = gGridX.selectAll("line")
                            .data(d3.range(0, pageHeigth, $scope.editor.grid.sizeYmm *
                                $scope.editor.features.pixelPerMmY));

                        lineX.enter().append("line")
                            .attr("y1", function(d){return d;})
                            .attr("x1", 0)
                            .attr("x2", 0)
                            .transition()
                            .duration(DURATION)
                            .attr("y2", function(d){return d;})
                            .attr("x2", pageWidth)
                    }

                    $scope.editor.behavior.d3.zoom = d3.behavior.zoom()
                        .scale(1)
                        .scaleExtent([.2, 10]) //min-max zoom
                        .on("zoom", zoomed);

                    g.call($scope.editor.behavior.d3.zoom);
                    $scope.editor.behavior.d3.zoom.event( $scope.editor.svg.container );

                    $scope.editor.features.centring = function (){

                        $scope.editor.svg.container.centerX = ( $element[0].clientWidth - pageWidth ) / 2;
                        $scope.editor.svg.container.centerY = ( $element[0].clientHeight - pageHeigth ) / 2;
                        //$scope.editor.behavior.d3.zoom
                        //    .translate([200, 100]).scale(1);
                        $scope.editor.svg.container
                            .attr("transform", "translate(" + $scope.editor.svg.container.centerX + "," + $scope.editor.svg.container.centerY + ") scale ("+
                            $scope.editor.scale + ")");

                    };

                    function zoomed(){

                        $scope.editor.svg.container
                            .attr("transform", "translate(" + t + ") scale (" +
                            d3.event.scale + ")");

                        t = t.toString().split(",");
                        $scope.editor.position.x = t[0];
                        $scope.editor.position.y = t[1];
                        $scope.editor.scale = d3.event.scale;
                    }


                    setTimeout(function(){
                        $scope.editor.translateTo({x: 300, y: 400}.then(function(message){
                            console.log(message);
                        }), 3000);
                    })


                });
            }
        }
    }
];