import {
    getLanguageById,
    submitBatch,
    submitToken,
} from "./problemUtility.js";

export const executeCode = async (
    code,
    language,
    testCases
) => {

    if (language === "cpp") {
        language = "c++";
    }

    const languageId = getLanguageById(language);

    const submissions = testCases.map((testCase) => ({
        source_code: code,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.output,
    }));

    const submitResult = await submitBatch(submissions);
    console.log("Submit Result:", submitResult);

    const tokens = submitResult.map(
        (submission) => submission.token
    );
    console.log("Tokens:", tokens);

    const testResults = await submitToken(tokens);
    console.log("Test Results:", testResults);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let success = true;
    let errorMessage = null;

    for (const test of testResults) {

        const statusId = test.status_id ?? test.status?.id;

        if (statusId === 3) {

            testCasesPassed++;

            runtime += parseFloat(test.time || 0);

            memory = Math.max(memory, test.memory || 0);

        } else {

            success = false;

            errorMessage =
                test.stderr ||
                test.compile_output ||
                "Unknown Error";
        }
    }

    return {
        success,
        runtime,
        memory,
        errorMessage,
        testCasesPassed,
        totalTestCases: testCases.length,
        testResults,
    };
};