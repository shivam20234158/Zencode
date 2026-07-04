function CodeEditor() {

    return (

        <div className="h-full flex flex-col">

            <div className="border-b p-4 flex justify-between">

                <select className="select select-bordered">

                    <option>C++</option>

                    <option>Java</option>

                    <option>Python</option>

                    <option>JavaScript</option>

                </select>

                <div className="space-x-2">

                    <button className="btn btn-outline">

                        Run

                    </button>

                    <button className="btn btn-primary">

                        Submit

                    </button>

                </div>

            </div>

            <div className="flex-1 flex justify-center items-center">

                Monaco Editor Here

            </div>

            <div className="border-t p-5">

                Output Console

            </div>

        </div>

    );

}

export default CodeEditor;