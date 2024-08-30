// Finds ALL courses including numerous optional courses that are part of any module. I do not recommend using this, but leaving just in case!
function findAllCourseUnitRules(obj, results = []) {
  if (obj !== null && typeof obj === "object") {
    if (obj.type === "CourseUnitRule") {
      results.push(obj);
    }

    Object.values(obj).forEach((value) => {
      findAllCourseUnitRules(value, results);
    });
  }

  return results;
}

// Finds only those courses that belong to module where all courses are mandatory.
function findMandatoryCourseUnitRules(
  obj,
  isWithinRequiredModule = false,
  results = []
) {
  if (obj !== null && typeof obj === "object") {
    if (obj.type === "ModuleRule" && obj.dataNode?.rule?.allMandatory) {
      isWithinRequiredModule = true;
    }

    if (obj.type === "CourseUnitRule" && isWithinRequiredModule) {
      results.push(obj);
    }

    Object.values(obj).forEach((value) => {
      if (typeof value === "object") {
        const newContext =
          obj.type === "ModuleRule" && !obj.dataNode?.rule?.allMandatory
            ? false
            : isWithinRequiredModule;
        findMandatoryCourseUnitRules(value, newContext, results);
      }
    });
  }

  return results;
}

// Finds only those modules which contain the allmandatory and discards the rest.
function findAndFilterMandatoryModuleRules(obj) {
  const results = [];
  if (obj !== null && typeof obj === "object") {
    if (obj.type === "ModuleRule") {
      // Process each ModuleRule through filterMandatoryModules
      const filteredModule = filterMandatoryModules(obj);
      // If the module is compliant, add it to the results
      if (filteredModule !== null) {
        results.push(filteredModule);
      }
    }

    // Recurse into all properties of the object
    Object.values(obj).forEach((value) => {
      if (typeof value === "object") {
        results.push(...findAndFilterMandatoryModuleRules(value));
      }
    });
  }
  return results;
}

function filterMandatoryModules(module) {
  // Base case: If the current object is not an object, return it as is
  if (module === null || typeof module !== "object") {
    return module;
  }

  // For ModuleRule with allMandatory: true, process its children
  if (module.type === "ModuleRule" && module.dataNode?.rule?.allMandatory) {
    // If it has nested rules/modules, filter them recursively
    if (Array.isArray(module.dataNode.rule.rules)) {
      // Filter out any non-compliant child modules
      const filteredRules = module.dataNode.rule.rules
        .map((child) => filterMandatoryModules(child)) // Recurse into children
        .filter(
          (child) =>
            child !== null && child.dataNode?.rule?.allMandatory !== false
        ); // Keep if allMandatory or not a module

      // Update the module with filtered children
      module.dataNode.rule.rules = filteredRules;
    }

    // Return the module with its potentially filtered children
    return module;
  } else if (module.type === "ModuleRule") {
    // If the module is not allMandatory, return null to indicate removal
    return null;
  } else {
    // For other types, recurse into their properties but keep them as they are
    Object.keys(module).forEach((key) => {
      module[key] = filterMandatoryModules(module[key]);
    });
    return module;
  }
}

function findModulesWithCourses(obj) {
  const results = [];

  function hasDirectCourse(module) {
    return module.dataNode?.rule?.rules?.some(
      (rule) => rule.type === "CourseUnitRule"
    );
  }

  function recurseAndFilter(obj) {
    if (obj !== null && typeof obj === "object") {
      if (obj.type === "ModuleRule" && hasDirectCourse(obj)) {
        results.push(obj);
      } else {
        Object.values(obj).forEach((value) => recurseAndFilter(value));
      }
    }
  }

  recurseAndFilter(obj);
  return results;
}

module.exports = {
  findAllCourseUnitRules,
  findMandatoryCourseUnitRules,
  findAndFilterMandatoryModuleRules,
  findModulesWithCourses,
};
