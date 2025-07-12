import { Header } from "@/components/website/Header";
import { Footer } from "@/components/website/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Image */}
        <div
          className="relative h-80 bg-cover bg-center bg-gray-200"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&h=400&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-20 relative">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-8">
              <span>HOME</span> &gt; <span>늘봄소개</span>
            </div>

            {/* Main Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                늘 봄!
              </h1>

              <div className="space-y-6 text-gray-700 leading-relaxed max-w-3xl mx-auto">
                <div className="text-lg">
                  설렘과 새로움이 가득한 봄.
                  <br />
                  만물이 다시금 활짝 피어나는 봄.
                  <br />
                  이렇듯 봄은 시작을 의미합니다.
                </div>

                <div className="text-lg pt-4">
                  저희 늘봄은
                  <br />
                  신랑, 신부님의 또 다른 인생의 시작이
                  <br />
                  <span className="font-bold text-gray-900">
                    따뜻한 봄날처럼 행복하기를 기원합니다.
                  </span>
                  <br />
                  또한 앞으로의 결혼 생활이
                  <br />늘 따스하기를 진심으로 기도합니다.
                </div>

                <div className="text-lg pt-8">
                  인생의 또 다른 새 출발을 간절히 축복하는
                  <br />
                  <span className="font-bold text-gray-900">
                    진심(盡心)과 진정(眞情)으로
                    <br />
                    여러분과 함께하겠습니다.
                  </span>
                </div>

                <div className="text-lg pt-4">
                  수천 번의 결혼식을 진행해도
                  <br />
                  수천 번의 새로운 마음가짐으로
                  <br />
                  함께 하겠습니다.
                </div>

                <div className="text-lg pt-4">
                  틀에 박힌 진행, 형식적인 진행을 탈피하여
                  <br />
                  두 분께서 진정으로 원하는
                  <br />
                  <span className="font-bold text-gray-900">
                    하나뿐인 결혼식을 선물해 드리겠습니다.
                  </span>
                </div>

                <div className="text-lg pt-8">
                  늘봄은 두 분의 결혼식을
                  <br />
                  일생에 잊지 못할 행복한 추억으로
                  <br />
                  만들어 드릴 것을
                </div>

                <div className="text-3xl font-bold text-gray-900 pt-4 text-center">
                  정중히 약속드립니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
