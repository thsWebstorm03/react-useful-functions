/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const exp = require('./expression');
const common = require('./common');

/**
 * Access Class, used to represent the access status of a write rule or node
 * @param status access status, could be NO_ACCESS/SINGLE_ACCESS/MULT_ACCESS
 * @param list variable list, should be empty list if status is NO/SINGLE,
 * else should be the list of literal in the conjunction of corresponding exp
 * @param condition optional condition for access status, inherited directly from
 * corresponding expression, default null
 */
function Access(status, list, condition = null) {
  if (![exp.NO_ACCESS, exp.SINGLE_ACCESS, exp.MULT_ACCESS].includes(status)) {
    throw 'Not a valid access status.';
  }
  this.accessStatus = status;

  if (status !== exp.SINGLE_ACCESS) {
    this.variableList = [];
    this.condition = null;
    return;
  }
  if (!checkVariableList(list)) {
    throw 'Not a valid list of variable for single access.';
  }
  this.condition = condition;
  this.variableList = list;
}

/**
 * Helper function, validity checking for variable list.
 * @param list input list, should be list of strings
 */
const checkVariableList = list =>
    Array.isArray(list) && list.length > 0 && list.every(variable =>
    typeof variable === 'string');

/**
 * Getter of access status
 */
Access.prototype.getAccessStatus = function() {
  return this.accessStatus;
};

/**
 * Getter of condition, could be null if no condition
 */
Access.prototype.getCondition = function() {
  return this.condition;
};

/**
 * Getter of access pattern
 * @param path path to the current node, list of strings
 * @return accessPattern object with path and an optional condition field
 */
Access.prototype.getAccessPattern = function(path) {
  if (path[0] !== 'rules') {
    throw `A valid path starts with 'rules'`;
  }
  const result = path.map(
      cur => this.getVariableList().includes(cur) ? common.WIPEOUT_UID : cur);
  result[0] = '';
  const ret = {'path': result.join('/')};
  let cond = this.getCondition();
  if (cond !== null) {
    // replace any auth variable with holder
    for (let i = 0; i < this.getVariableList().length; i++) {
      const re = new RegExp(`\\${this.getVariableList()[i]}\\b`, 'g');
      cond = cond.replace(re, common.WIPEOUT_UID);
    }
    ret.condition = cond;
  }
  return ret;
};

Access.prototype.getVariableList = function() {
  return this.variableList;
};

/**
 * Create access object from expression object.
 * The access object describes the access pattern of the expression
 * @param expression input expression object
 */
Access.fromExpression = function(expression) {
  const status = expression.getAccessNumber();
  const cond = expression.getCondition();
  if ((status === exp.NO_ACCESS) || (status === exp.MULT_ACCESS)) {
    return new Access(status, [], cond);
  }
  return new Access(status, expression.getConjunctionLists()[0], cond);
};

/**
 * Get access status of the node, according to access of the
 * rule at the location and access status of its ancestor
 * @param ancestor access object of ancestor of the current node
 * @param ruleAccess access object of write rule at the current place
 */
Access.nodeAccess = function(ancestor, ruleAccess) {
  switch (ancestor.getAccessStatus()) {

    case exp.MULT_ACCESS:
      // If either access is MULT then result is MULT
      return new Access(exp.MULT_ACCESS, []);

    case exp.NO_ACCESS:
      // If ancestor has no access, then rule access applies
      return ruleAccess;

    case exp.SINGLE_ACCESS:
      switch (ruleAccess.getAccessStatus()) {

        case exp.NO_ACCESS:
          // If rule adds no access, then ancestor access applies
          return ancestor;

        case exp.MULT_ACCESS:
          // If either access is MULT then result is MULT
          return new Access(exp.MULT_ACCESS, []);

        case exp.SINGLE_ACCESS:
          // If both accesses are SINGLE, then the result is either SINGLE or
          // MULT depending on whether every variables are a subset of the
          // rules variables (whether the rule grants additional access beyond
          // its ancestor).
          const noAdditionalAccess = ancestor.getVariableList().every(
              ancVariable => ruleAccess.getVariableList().includes(ancVariable)
              );
          if (noAdditionalAccess) {
            // If the child node has single access, the child node condition
            // is the OR of child rule condition and parent node condition.
            const newCond = exp.condOperation(ancestor.getCondition(),
                ruleAccess.getCondition(), '||');
            return new Access(exp.SINGLE_ACCESS, ancestor.getVariableList(),
                newCond);
          }
          return new Access(exp.MULT_ACCESS, []);
      }
  }
};

module.exports = Access;
