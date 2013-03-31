/**
 * Angular.js GameOfLife Controller
 * Author: Stéphane LEROY
 * Twitter : @StphaneL
 * Date: 02/03/13
 * Time: 15:29
 */

angular.module("GameOfLife", ['WorldProvider']);

function GameOfLifeCtrl($scope, $timeout, World) {

    // World initialisation
    $scope.world = World.world;

    $scope.nbRows = World.nbRows();
    $scope.nbColumns = World.nbColumns();
    $scope.addColumn = function() {
        World.addColumn();
        $scope.nbColumns = World.nbColumns();
    };
    $scope.removeColumn = function() {
        World.removeColumn();
        $scope.nbColumns = World.nbColumns();
    };
    $scope.addRow = function() {
        World.addRow();
        $scope.nbRows = World.nbRows();
    };
    $scope.removeRow = function() {
        World.removeRow();
        $scope.nbRows = World.nbRows();
    };
    $scope.reset = function() {
        World.reset();
    };

    var worldRules = function (cell) {
        var neighbours = cell.neighbours();

        // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
        if(neighbours<2) {
            return function() {
                cell.kill();
            }
        }
        // Any live cell with more than three live neighbours dies, as if by overcrowding.
        if(neighbours>3) {
            return function() {
                cell.kill();
            }
        }
        // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        if(neighbours == 3 && !cell.isAlive) {
            return function() {
                cell.born();
            }
        }
        return null;
    }

    // Compute the next step
    $scope.ruleTheWorld = function() {
        var rules=World.visit(worldRules);
        for(var i=0; i<rules.length; i++) {
               rules[i].apply(this);
        }
    };

    // State of 'auto-step' mode
    $scope.started = false;

    // One step
    var step = function () {
        if($scope.started) {
            $scope.ruleTheWorld();
        }
        $timeout(step, 300);
    };
    step();

    // start 'auto-step' mode
    $scope.start = function() {
        $scope.started = true;
    };

    // stop 'auto-step' mode
    $scope.stop = function() {
        $scope.started = false;
    };
}